type StatsCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function StatsCard({
  title,
  value,
  subtitle,
}: StatsCardProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8">

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      <p className="text-5xl font-bold text-blue-400">
        {value}
      </p>

      <p className="text-slate-400 mt-4">
        {subtitle}
      </p>

    </div>
  );
}