declare module "rewrite-imports" {
  export function rewrite(input: string, fn?: string): string
}

declare module "rewrite-exports" {
  export default function rewrite(
    input: string,
    ctx?: string,
    fn?: string,
    x?: string
  ): string
}
