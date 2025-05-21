import { createContext } from "react";
import { PostStore} from "./post-store";

export const PostContext = createContext<PostStore| null>(null);
