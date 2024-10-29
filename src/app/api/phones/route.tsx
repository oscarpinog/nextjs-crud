import { NextResponse } from "next/server";

const url = process.env.API_URL;

export async function GET(request: Request) {
  try {
    //Verificamos que la URL de la API esté definida para evitar errores por falta de configuración.
    if (!url) {
      return NextResponse.json(
        { error: "API URL not defined" },
        { status: 500 }
      );
    }
    //El uso de { cache: 'no-store' } garantiza que la petición siempre obtenga los datos más recientes.
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const phones = await res.json();
    return NextResponse.json(phones, { status: 200 });
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parseamos el cuerpo de la solicitud como JSON
    const body = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "API URL not defined" },
        { status: 500 }
      );
    }

    // Realizamos la petición POST a la API externa
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
