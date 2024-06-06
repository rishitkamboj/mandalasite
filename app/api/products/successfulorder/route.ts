import { NextResponse, NextRequest } from "next/server";
import client from "@/db";

export async function PATCH(req: NextRequest) {
    let body = await req.json();
    console.log(body);

    const ids = body.id;
    if (!Array.isArray(ids)) {
        return NextResponse.json({ status: 400, message: "Request body should have an 'id' property which is an array" });
    }

    const results = [];

    for (const id of ids) {
        if (!id) {
            results.push({ status: 400, message: "Invalid request body, missing id" });
            continue;
        }

        const find = await client.product.findUnique({ where: { id: Number(id) } });
        if (!find) {
            results.push({ status: 404, message: "Product not found", id });
            continue;
        }

        const q = find.availablequantity;
        if (q === 1) {
            const del = await client.product.delete({ where: { id: Number(id) } });
            results.push({ status: 200, message: "Product deleted successfully", del });
        } else {
            const update = await client.product.update({ where: { id: Number(id) }, data: { availablequantity: q - 1 } });
            results.push({ status: 200, message: "Product updated successfully", update });
        }
    }

    return NextResponse.json(results);
}
