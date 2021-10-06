import * as React from "react";
import { ClassNames } from "@44north/classnames";
import { FaRegSquare, FaRegCheckSquare, FaTimes, FaRegCopy, FaCog } from "react-icons/fa";
import { Popover, Transition } from "@headlessui/react";
import NotyfContext from "./NotyfContext";
import { IRecord, sharedInputClasses } from "./types";

interface IOutputProps {
    className?: string | ClassNames;
    recordSet: IRecord[];
}

interface IFlagOption {
    label: string;
    flag: string;
    isOn: boolean;
}

const defaultFlags: IFlagOption[] = [
    {
        label: "Force",
        flag: "-f",
        isOn: false
    },
    {
        label: "No Prune",
        flag: "--no-prune",
        isOn: false
    }
];

const Output: React.FC<IOutputProps> = ({ className = "", recordSet }) => {
    const [filter, setFilter] = React.useState<string>("");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [flags, setFlags] = React.useState<IFlagOption[]>(defaultFlags);
    const notyf = React.useContext(NotyfContext);

    const toggleSelected = (idList: string) => {
        let current = [...selected];

        const ids: string[] = [];
        idList.split(" ").forEach((value) => {
            if (ids.indexOf(value) === -1) {
                ids.push(value);
            }
        });

        ids.forEach((id) => {
            const currentIndex = current.indexOf(id);
            if (currentIndex >= 0) {
                current = current.filter((value) => value !== id);
            } else {
                current.push(id);
            }
        });

        setSelected(current);
    };

    const getFiltered = recordSet.filter((record) => {
        if (filter.length > 0) {
            const flatRecord = Object.values(record).join(" ");

            return new RegExp(filter, "gi").test(flatRecord);
        } else {
            return true;
        }
    });

    const getDockerRMIValue = () => {
        const cmds: string[] = ["docker", "rmi"];

        flags
            .filter((flag) => flag.isOn)
            .forEach((flag) => {
                cmds.push(flag.flag);
            });

        return `${cmds.join(" ")} ${selected.join(" ")}`;
    };

    const commonCellClasses = new ClassNames("py-1 px-2 font-mono");
    const commonHeaderCellClasses = new ClassNames(commonCellClasses.list()).add([
        "text-left",
        "border-b border-b-gray-500"
    ]);

    return (
        <div className={new ClassNames(className).add(["flex flex-col"]).list()}>
            <div className={new ClassNames(["relative"]).list()}>
                <input
                    className={new ClassNames(sharedInputClasses).list("w-full")}
                    placeholder="filter"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                <div
                    className={new ClassNames([
                        "absolute",
                        "top-0 bottom-0 right-0",
                        "flex justify-center items-center"
                    ]).list()}
                >
                    <button
                        className={new ClassNames([
                            "text-gray-300 hover:text-gray-900",
                            "px-4"
                        ]).list()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            setFilter("");
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>
            <div className="overflow-scroll flex-grow">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr>
                            <th
                                className={new ClassNames(commonHeaderCellClasses)
                                    .add("w-10 ")
                                    .list()}
                            >
                                <button
                                    className="mt-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        toggleSelected(
                                            getFiltered.map((record) => record.id).join(" ")
                                        );
                                    }}
                                >
                                    <FaRegSquare />
                                </button>
                            </th>
                            <th
                                className={new ClassNames(commonHeaderCellClasses)
                                    .add("w-36")
                                    .list()}
                            >
                                id
                            </th>
                            <th className={new ClassNames(commonHeaderCellClasses).list()}>name</th>
                            <th
                                className={new ClassNames(commonHeaderCellClasses)
                                    .add("w-36")
                                    .list()}
                            >
                                tag
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFiltered.map((record) => (
                            <tr key={`${record.id}-${record.tag}}`} className="hover:bg-gray-400">
                                <td className={new ClassNames(commonCellClasses).list()}>
                                    <button
                                        className="mt-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            toggleSelected(record.id);
                                        }}
                                    >
                                        {selected.some((value) => value === record.id) ? (
                                            <FaRegCheckSquare />
                                        ) : (
                                            <FaRegSquare />
                                        )}
                                    </button>
                                </td>
                                <td className={new ClassNames(commonCellClasses).list()}>
                                    <button
                                        className="whitespace-nowrap"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            toggleSelected(record.id);
                                        }}
                                    >
                                        {record.id}
                                    </button>
                                </td>
                                <td className={new ClassNames(commonCellClasses).list()}>
                                    <button
                                        className="hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setFilter(record.name);
                                        }}
                                    >
                                        {record.name}
                                    </button>
                                </td>
                                <td
                                    className={new ClassNames(commonCellClasses)
                                        .add("whitespace-nowrap")
                                        .list()}
                                >
                                    {record.tag}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4">
                {selected.length === 0 ? (
                    <p className="text-gray-500">None Selected - {recordSet.length} Images Found</p>
                ) : (
                    <div className="flex space-x-4 items-center">
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();

                                const input = document.createElement("input");
                                input.value = getDockerRMIValue();
                                document.body.appendChild(input);

                                input.select();
                                document.execCommand("copy");
                                document.body.removeChild(input);

                                notyf.success("Copied");
                            }}
                        >
                            <FaRegCopy />
                        </button>
                        <code className="select-all flex-grow">{getDockerRMIValue()}</code>
                        <div className="flex">
                            <button
                                className={new ClassNames([
                                    "p-2 rounded",
                                    "hover:bg-gray-400"
                                ]).list()}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setSelected([]);
                                }}
                            >
                                <FaTimes />
                            </button>
                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={new ClassNames([
                                                "p-2 rounded",
                                                "hover:bg-gray-400"
                                            ])
                                                .add({ "bg-gray-500": open })
                                                .list()}
                                        >
                                            <FaCog />
                                        </Popover.Button>
                                        <Transition
                                            enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0"
                                        >
                                            <Popover.Panel className="absolute z-10 bg-white text-gray-900 rounded-xl bottom-10 right-0 p-4">
                                                <ul>
                                                    {flags.map((flag) => (
                                                        <li key={flag.label}>
                                                            <button
                                                                className="flex items-center space-x-2"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();

                                                                    const current = [...flags];
                                                                    const index = current.findIndex(
                                                                        (r) =>
                                                                            r.label === flag.label
                                                                    );

                                                                    const currentRecord = {
                                                                        ...current[index]
                                                                    };
                                                                    currentRecord.isOn =
                                                                        !currentRecord.isOn;

                                                                    current[index] = currentRecord;
                                                                    setFlags(current);
                                                                }}
                                                            >
                                                                {flag.isOn ? (
                                                                    <FaRegCheckSquare />
                                                                ) : (
                                                                    <FaRegSquare />
                                                                )}
                                                                <p className="whitespace-nowrap">
                                                                    {flag.label}
                                                                </p>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Output;
export { Output };
