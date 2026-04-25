import styles from "../Walks.module.css";

import { Select } from "radix-ui";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { forwardRef } from "react";

export default function SelectDropdown({
  Icon,
  label,
  value,
  onChange,
  options,
}: {
  Icon?: React.ReactElement;
  label: string;
  value: string;
  onChange: (values: string) => void;
  options: { [value: string]: string };
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className={styles.dropdownTrigger} aria-label={label}>
        {/* <span>{label}</span> */}
        <div>
          {Icon}
          <Select.Value placeholder={label} />
        </div>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.dropdownContent} position="popper">
          <Select.ScrollUpButton>
            <ChevronUpIcon />
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
            <ChevronDownIcon />
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
      className,
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
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
