import { createContext } from "react";
import { PostFormStore } from "./post-form-store";

export const PostFormContext = createContext<PostFormStore | null>(null);
