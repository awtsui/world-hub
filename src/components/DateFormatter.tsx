interface DateFormatterProps {
  date: Date;
}

export default function DateFormatter({ date }: DateFormatterProps) {
  try {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
    return <span>{formattedDate}</span>;
  } catch (error) {
    throw error;
  }
}
