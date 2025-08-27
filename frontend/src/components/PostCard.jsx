import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 cursor-pointer">
            <div className="p-6">
                <Link to={`/post/${post.id}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                    </h2>
                </Link>
                <p className="text-gray-600 text-sm mb-4">
                    Pubblicato da <span className="font-semibold">{post.author}</span> il {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {post.content}
                </p>
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
