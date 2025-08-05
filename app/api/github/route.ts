import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    const githuburl = "https://github.com/sanjaysagar12/vm-sim";
    return NextResponse.json({ githuburl });
}

export async function POST(req: NextRequest) {
    const githuburl = "https://github.com/sanjaysagar12/isl-ui/";
    return NextResponse.json({ githuburl });
}