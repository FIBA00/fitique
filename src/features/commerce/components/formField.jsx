export default function FormField({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder,
}) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        placeholder={placeholder}
        {...register(name)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <p className="field-error">{errors[name].message}</p>}
    </label>
  );
}
