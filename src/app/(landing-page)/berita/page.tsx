import Link from 'next/link';
import React from 'react'

const BeritaPage = () => {
    const articles = [
        { id: 1, title: 'Berita 1', summary: 'Ringkasan berita 1' },
        { id: 2, title: 'Berita 2', summary: 'Ringkasan berita 2' },
        // Tambahkan lebih banyak berita sesuai kebutuhan
    ];
    return (
        <div>
            <h1>Berita Terbaru</h1>
            {articles.map((article) => (
                <div key={article.id} className="card">
                    <h2>{article.title}</h2>
                    <p>{article.summary}</p>
                    <Link href={`/${article.id}`}>
                        <p>Read More</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default BeritaPage