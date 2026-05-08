type InputProps = {
  type?: string;
  placeholder?: string;
};

export default function Input({
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500"
    />
  );
}