// app/api/generateAvatar/route.js
import { NextResponse } from "next/server";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#95a5a6",
    "#d35400",
];

export async function POST(request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Générer les initiales du nom
        const initials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();

        // Sélectionner une couleur aléatoire dans la liste
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Créer l'avatar en pixel art avec DiceBear
        const avatar = createAvatar(pixelArt, {
            seed: initials, // Utiliser les initiales comme seed
            backgroundColor: [randomColor], // Appliquer la couleur de fond
            size: 128, // Taille de l'avatar
        });

        // Convertir l'avatar en URL SVG
        const avatarUrl = avatar.toDataUri();

        return NextResponse.json({ avatarUrl }, { status: 200 });
    } catch (error) {
        console.error("Error generating avatar:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
