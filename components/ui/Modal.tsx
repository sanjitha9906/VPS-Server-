type ModalProps = {
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  title,
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="w-full max-w-xl bg-[#0b1120] border border-slate-800 rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-white mb-6">
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
}