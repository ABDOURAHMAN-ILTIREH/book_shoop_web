interface DateFormatter {
  (date: string): string;
}

export const formatDateWithDay: DateFormatter = (date) =>
  new Date(date).toLocaleString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateSimple: DateFormatter = (date) =>
  new Date(date).toLocaleDateString('fr-FR');

export const formatDateTime: DateFormatter = (date) =>
  new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateShort: DateFormatter = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
});
