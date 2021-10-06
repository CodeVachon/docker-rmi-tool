import { ClassNames } from "@44north/classnames";

export interface IRecord {
    id: string;
    name: string;
    tag: string;
}

export const sharedInputClasses = new ClassNames([
    "bg-white text-black dark:bg-gray-100 dark:text-black",
    "py-2.5 px-4"
]);
