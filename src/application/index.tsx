import * as React from "react";
import { ClassNames } from "@44north/classnames";
// import { testData } from "./testdata";
const testData = ``;
import { IRecord, sharedInputClasses } from "./types";

import { FaTimes } from "react-icons/fa";
import { Output } from "./output";
interface IApplicationProps {
    className?: string;
}

const parseRawRecordSet = (raw: string): IRecord[] => {
    const recordSet: IRecord[] = [];

    raw.split(new RegExp("[\\n\\r]{1,}"))
        .filter((row) => row.trim().length > 0)
        .filter((row) => new RegExp("^([^\\s]{1,}\\s{1,}){3}.+$").test(row.trim()))
        .filter((row) => !new RegExp("^REPOSITORY").test(row.trim()))
        .forEach((row) => {
            const [name, tag, id] = row
                .trim()
                .split(new RegExp("\\s{1,}"))
                .filter((value) => value.trim().length > 0);

            if (new RegExp("^[a-z0-9]{12}$").test(id)) {
                recordSet.push({
                    id,
                    name,
                    tag
                });
            }
        });

    return recordSet;
};

const Application: React.FC<IApplicationProps> = ({ className = "" }) => {
    const [rawRecordSet, setRawRecordSet] = React.useState<string>(testData);
    const [recordSet, setRecordSet] = React.useState<IRecord[]>(parseRawRecordSet(testData));
    const [activeTab, setActiveTab] = React.useState<number>(0);

    React.useEffect(() => {
        setRecordSet(parseRawRecordSet(rawRecordSet));
    }, [rawRecordSet]);

    const tabs: {
        label: string;
        content: React.ReactNode;
    }[] = [
        {
            label: "Input",
            content: (
                <>
                    <textarea
                        style={{ resize: "none" }}
                        className={new ClassNames(sharedInputClasses)
                            .add(["w-full flex-grow"])
                            .list()}
                        value={rawRecordSet}
                        onChange={(e) => setRawRecordSet(e.target.value)}
                        placeholder="Copy and Paste the result from `docker images`"
                    />
                    <div
                        className={new ClassNames([
                            "absolute",
                            "top-4 right-4",
                            "flex justify-center items-center"
                        ]).list()}
                    >
                        <button
                            className={new ClassNames(["text-gray-300 hover:text-gray-900"]).list()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setRawRecordSet("");
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </>
            )
        },
        {
            label: "Output",
            content: <Output recordSet={recordSet} className="absolute inset-0 z-10" />
        }
    ];

    return (
        <div className={new ClassNames(className).add(["flex flex-col h-screen"]).list()}>
            <nav>
                <ul className={new ClassNames(["flex"]).list()}>
                    {tabs.map((tab, index) => (
                        <li key={`tab-${index}-${tab.label}`}>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setActiveTab(index);
                                }}
                                className={new ClassNames([
                                    "px-6 py-4 text-lg",
                                    "hover:bg-blue-300"
                                ])
                                    .add({ "bg-blue-400": activeTab === index })
                                    .list()}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div
                className={new ClassNames([
                    "overflow-scroll",
                    "flex-grow",
                    "flex flex-col",
                    "relative"
                ]).list()}
            >
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Application;
