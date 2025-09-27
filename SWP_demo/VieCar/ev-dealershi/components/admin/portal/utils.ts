export function formatCurrencyVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function clsx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ")
}
