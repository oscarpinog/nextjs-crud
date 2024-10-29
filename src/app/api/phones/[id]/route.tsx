import { NextResponse } from "next/server";

const url = process.env.API_URL;

// Traer un producto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Define params como una Promesa
) {
  const { id } = await params; // Espera a que params se resuelva
  console.log('ID:', id); // Ahora puedes acceder a id

  try {
    const result = await fetch(`${url}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const product = await result.json();
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}
