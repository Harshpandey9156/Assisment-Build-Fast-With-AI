import { db } from "@/db"; // Import your database instance
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Import Kinde session for real authentication
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define your FileRoutes, here with 'imageUploader'
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Use Kinde for real authentication
      const session = getKindeServerSession();
      const user = session?.getUser();

      // If the user is not authenticated, throw an error
      if (!user || !(await user).id) throw new UploadThingError("Unauthorized");

      // Return userId as metadata for later use in onUploadComplete
      return { userId: (await user).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Save the uploaded file details to the database
        const createdFile = await db.file.create({
          data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
            uploadStatus: "PROCESSING", // Initially mark the file as processing
          },
        });
        console.log("File successfully saved to DB", createdFile);
      } catch (error) {
        console.error("Error saving file to DB: ", error);
      }

      // Log the file upload information for debugging
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return data to the clientside callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
