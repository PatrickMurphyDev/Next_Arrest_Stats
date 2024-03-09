interface IDashboardHeadingCustomProps {
  title: string;
  replacementSlug?: Array<string> | string;
  replacementValue?: Array<string> | string | number;
}

export function DashboardHeadingCustom(props: IDashboardHeadingCustomProps) {
  let inTitle = props.title || 'Default Title';
  const inRepSlug = props.replacementSlug || '?';
  const inRepVal = props.replacementValue || 'Value';

  if (typeof inRepSlug === 'string') {
    if (inTitle.indexOf(inRepSlug) >= 0) {
      // found
      inTitle = inTitle.replace(inRepSlug, inRepVal as string);
    }
  }
  return (
    <div className="mx-1.5 mb-0 mt-1.5">
      <h2 className="border-b-2 border-black">{inTitle}</h2>
    </div>
  );
}
