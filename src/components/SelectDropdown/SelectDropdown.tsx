import styles from "./SelectDropdown.module.css";

import { Select } from "radix-ui";
import { forwardRef } from "react";
import { CaretUpIcon, CaretDownIcon, TickIcon } from "@/icons/PhosphorIcons";

export default function SelectDropdown({
  Icon,
  label,
  value,
  onChange,
  options,
  triggerClassName,
  contentClassName,
}: {
  Icon?: React.ReactElement;
  label: string;
  value: string;
  onChange: (values: string) => void;
  options: { [value: string]: string };
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`${styles.dropdownTrigger} ${triggerClassName ? triggerClassName : ""}`}
        aria-label={label}
        data-selected={value !== "any"}
      >
        <div>
          {Icon}
          <Select.Value placeholder={label} className={styles.dropdownValue}>
            <span data-screen="small">
              {value === "any" ? "Any" : options[value]}
            </span>
            <span data-screen="normal">{options[value]}</span>
          </Select.Value>
        </div>
        <Select.Icon>
          <CaretDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={`${styles.dropdownContent} ${contentClassName ? contentClassName : ""}`}
          position="popper"
        >
          <Select.ScrollUpButton>
            <CaretUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {Object.keys(options).map((optkey, index) => {
              return (
                <SelectItem value={optkey} key={index}>
                  {options[optkey]}
                </SelectItem>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton>
            <CaretDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = forwardRef(
  (
    {
      value,
      children,
      ...props
    }: { value: string; className?: string; children?: React.ReactNode },
    forwardedRef: React.Ref<HTMLDivElement | null>,
  ) => {
    return (
      <Select.Item
        value={value}
        {...props}
        className={styles.dropdownItem}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <TickIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";
