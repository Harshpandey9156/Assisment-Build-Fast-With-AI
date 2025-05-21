"use client";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
// import { pdfjs } from 'react-pdf';

// Import the worker directly or specify the path if you downloaded it locally
pdfjs.GlobalWorkerOptions.workerSrc = '/path/to/pdf.worker.js';


// Set worker source manually to prevent the fake worker issue
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.0/pdf.worker.min.js'

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!, { message: "Page number out of range" }),
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: { page: '1' },
    resolver: zodResolver(CustomPageValidator),
  });
  console.log("PDF URL: ", url);  // Check if the URL is valid


  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: { page: string }) => {
    const pageNumber = Number(page);
    setCurrPage(pageNumber);
    setValue('page', String(pageNumber));
  };

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              const newPage = currPage - 1 > 1 ? currPage - 1 : 1;
              setCurrPage(newPage);
              setValue('page', String(newPage));
            }}
            variant='ghost'
            aria-label='previous page'>
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input
              {...register('page')}
              className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() => {
              const newPage = currPage + 1 > numPages! ? numPages! : currPage + 1;
              setCurrPage(newPage);
              setValue('page', String(newPage));
            }}
            variant='ghost'
            aria-label='next page'>
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                <Search className='h-4 w-4' /> {scale * 100}%
                <ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[1, 1.5, 2, 2.5].map((s) => (
                <DropdownMenuItem key={s} onSelect={() => setScale(s)}>
                  {s * 100}%
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setRotation((prev) => prev + 90)} variant='ghost' aria-label='rotate 90 degrees'>
            <RotateCw className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document 
              file={url}
              onLoadError={(error) => {
                console.error('Error loading PDF:', error);
                toast({
                  title: 'Error loading PDF',
                  description: error.message || 'Please try again later',
                  variant: 'destructive',
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className='max-h-full'>
              
              <Page
                className={cn(isLoading ? 'hidden' : '')}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={scale}
                loading={
                  <div className='flex justify-center'>
                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
