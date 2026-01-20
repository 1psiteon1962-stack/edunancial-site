import { NextRequest } from "next/server";

declare function GET(request: NextRequest): Promise<Response>;

export { GET };
