import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand";
import { CreatePost } from "@/lib/api";
import * as api from "@/lib/api";
import { hashObject } from "@/lib/utils";

export type MediaFile = {
  previewUrl: string;
  file: File;

  id?: string;
  uploadingPromise?: Promise<unknown>;
};

export type PostFormState = {
  content: string;
  images: MediaFile[];
};

export type PostFormActions = {
  actions: {
    setContent: (content: string) => void;
    addImage: (image: MediaFile) => void;
    addImages: (images: MediaFile[]) => void;
    addImageUploadingProgress: (file: File, promise: Promise<unknown>) => void;
    removeImage: (index: number) => void;
    uploadPost: () => Promise<void>;
    addMediumId: (file: File, mediaId: string) => void;
    reset: () => void;
  };
};

export type PostFormStore = ReturnType<typeof createPostFormStore>;

const DEFAULT_ARGS = {
  content: "",
  images: [],
};

export const createPostFormStore = (initProps?: Partial<PostFormState>) => {
  return createStore<PostFormState & PostFormActions>()(
    immer((set, get) => ({
      ...DEFAULT_ARGS,
      ...initProps,
      actions: {
        addMediumId: (file: File, mediaId: string) => {
          set((state) => {
            let ok = false;
            for (let index = 0; index < state.images.length; index++) {
              if (state.images[index].file === file) {
                state.images[index].id = mediaId;
                ok = true;
                return;
              }
            }
            if (!ok) {
              console.warn(
                "Could not find image to add medium ID to, this might be a bug.",
              );
            }
          });
        },

        addImageUploadingProgress: (file: File, promise: Promise<unknown>) => {
          set((state) => {
            state.images.filter(
              (image) => image.file === file,
            )[0].uploadingPromise = promise;
          });
        },

        uploadPost: async () => {
          let state = get();
          Promise.allSettled(
            state.images.map((image) => image.uploadingPromise),
          );

          state = get(); // refresh state after promises are settled
          for (const image of state.images) {
            if (!image.id) {
              console.warn(
                "Image does not have an ID, it might not have been uploaded successfully.",
              );
            }
          }

          // wait for all images to be uploaded
          const request: CreatePost = {
            content: state.content,
            mediaIds: state.images
              .map((image) => image.id)
              .filter((id) => id !== undefined),
          };
          await api.posts.create(request);
        },
        reset: () => {
          set((state) => {
            state.content = "";
            for (const image of state.images) {
              URL.revokeObjectURL(image.previewUrl);
            }
            state.images = [];
          });
        },
        setContent: (content: string) => {
          set((state) => {
            state.content = content;
          });
        },
        addImage: (image: MediaFile) => {
          set((state) => {
            if (!state.images) {
              state.images = [];
            }
            state.images.push(image);
          });
        },
        addImages: (images: MediaFile[]) => {
          set((state) => {
            if (!state.images) {
              state.images = [];
            }
            state.images.push(...images);
          });
        },
        removeImage: (index: number) => {
          set((state) => {
            if (state.images && state.images.length > index) {
              const image = state.images[index];
              URL.revokeObjectURL(image.previewUrl);
              state.images.splice(index, 1);
            }
          });
        },
      },
    })),
  );
};
