import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    const createdAt = post.created_at || post.createdAt;
    const preview = (post.description || post.content || '').toString();
    const mediaUrl = post.media_url || '';
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 cursor-pointer">
            <div className="p-6">
                <Link to={`/post/${post.id}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                    </h2>
                </Link>
                {createdAt && (
                    <p className="text-gray-600 text-sm mb-4">
                        Creato il {new Date(createdAt).toLocaleDateString()}
                    </p>
                )}
                {/* Media thumbnail (se immagine) sotto titolo e data */}
                {isImage && (
                    <Link to={`/post/${post.id}`} className="block mb-4">
                        <div className="w-full h-48 bg-white overflow-hidden rounded">
                            <img src={mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    </Link>
                )}
                {!isImage && (
                    <p className="text-gray-700 text-base mb-4 line-clamp-3">
                        {preview}
                    </p>
                )}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#{t}</span>
                        ))}
                    </div>
                )}
                <Link
                    to={`/post/${post.id}`}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                    Leggi di più
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
