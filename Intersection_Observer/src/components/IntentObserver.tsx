import React, { useEffect, useRef, useState, useCallback } from 'react';

// Mock data type
interface Post {
    id: number;
    title: string;
    body: string;
}

const IntentObserver = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useRef<HTMLDivElement | null>(null);

    // Fetch data from API
    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            // Using JSONPlaceholder API for demo purposes
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
            );
            const newPosts: Post[] = await response.json();

            if (newPosts.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    // Setup Intersection Observer
    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('Last post is visible, loading more...');
                fetchPosts();
            }
        }, {
            rootMargin: '100px', // Start loading before the element is visible
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        if (node) observer.current.observe(node);
        lastPostElementRef.current = node;
    }, [loading, hasMore, fetchPosts]);

    // Initial fetch
    useEffect(() => {
        fetchPosts();

        // Cleanup observer on unmount
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Infinite Scrolling
                    </h1>
                    <button
                        onClick={toggleTheme}
                        className={`px-4 py-2 rounded-full shadow-md transition-all duration-300 flex items-center
                            ${theme === 'dark'
                                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                                : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'}`}
                    >
                        {theme === 'dark' ? (
                            <><span className="mr-2">☀️</span> Light Mode</>
                        ) : (
                            <><span className="mr-2">🌙</span> Dark Mode</>
                        )}
                    </button>
                </div>

                <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} shadow-lg`}>
                    <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        About This Demo
                    </h2>
                    <p>
                        This component demonstrates infinite scrolling using the Intersection Observer API.
                        Scroll down to automatically load more content when you reach the end.
                    </p>
                </div>

                <div className="space-y-6">
                    {posts.map((post, index) => {
                        // Apply ref to the last post element
                        if (index === posts.length - 1) {
                            return (
                                <div
                                    key={post.id}
                                    ref={lastPostRef}
                                    className={`p-6 rounded-xl border transform transition-all hover:-translate-y-1 hover:shadow-xl
                                        ${theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-white'
                                            : 'bg-white border-gray-200 text-gray-800'}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0
                                            ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {post.id}
                                        </div>
                                        <div className="flex-grow">
                                            <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                                {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
                                            </h2>
                                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                                {post.body}
                                            </p>
                                            <div className="flex items-center mt-4">
                                                <div className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                    Post #{post.id}
                                                </div>
                                                <div className={`ml-auto text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Last item - loading more...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={post.id}
                                className={`p-6 rounded-xl border transform transition-all hover:-translate-y-1 hover:shadow-lg
                                    ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-800'}`}
                            >
                                <div className="flex items-start">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0
                                        ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {post.id}
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                            {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
                                        </h2>
                                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                            {post.body}
                                        </p>
                                        <div className="flex justify-end mt-4">
                                            <div className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                Post #{post.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className="flex justify-center items-center my-8 py-6">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
                            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Loading more posts...
                            </p>
                        </div>
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className={`text-center my-8 p-6 rounded-lg shadow-inner
                        ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium">You've reached the end</p>
                        <p className="text-sm opacity-75">No more posts to load</p>
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className={`text-center my-8 p-6 rounded-lg shadow
                        ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">No posts found</p>
                        <p className="text-sm opacity-75">Try refreshing the page</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntentObserver;