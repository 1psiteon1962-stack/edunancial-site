// Allow CSS side-effect imports (e.g. import './globals.css')
declare module "*.css" {}

// Silence Next.js internal JS route resolution during type checking
declare module "*.js" {
  const value: any;
  export default value;
  export const GET: any;
  export const POST: any;
  export const PUT: any;
  export const DELETE: any;
}
