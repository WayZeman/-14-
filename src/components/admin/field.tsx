export function AdminField({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: "text" | "textarea" | "number";
  rows?: number;
  placeholder?: string;
}) {
  const className = "mt-1 w-full border border-[var(--graphite)]/15 bg-white px-3 py-2 text-sm";
  return (
    <label className="block text-sm">
      <span className="font-medium text-[var(--graphite)]">{label}</span>
      {type === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          name={name}
          type={type === "number" ? "number" : "text"}
          required={required}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

export function AdminSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[var(--graphite)]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full border border-[var(--graphite)]/15 bg-white px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminSubmit({ children = "Зберегти" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--graphite)]"
    >
      {children}
    </button>
  );
}
