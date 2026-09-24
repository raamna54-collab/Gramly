/* =========================================================
   GRAMLY - FRONTEND SCRIPT
   Connected with Express + MongoDB Backend
========================================================= */

(() => {

    /* =========================================================
       1. CONSTANTS
    ========================================================= */

    const DB_KEY = "gramly_db_v1";
    const SESSION_KEY = "gramly_session";
    const TOKEN_KEY = "gramly_token";
    const THEME_KEY = "gramly_theme";

    const root = document.getElementById("root");
    const modalRoot = document.getElementById("modal-root");
    const toast = document.getElementById("toast");


    /* =========================================================
       2. LOCAL DATABASE
       Used for frontend-only features that are not yet
       connected to backend.
    ========================================================= */

    const defaultDB = {

        users: [
            {
                id: "u1",
                username: "aamna",
                name: "Aamna Rana",
                email: "aamna@test.com",
                bio: "Creating little moments ✨",
                avatar: "",
                hue: 330,
                followers: [],
                following: []
            },

            {
                id: "u2",
                username: "sara",
                name: "Sara Khan",
                email: "sara@test.com",
                bio: "Coffee, sunsets & memories ☕",
                avatar: "",
                hue: 25,
                followers: [],
                following: []
            },

            {
                id: "u3",
                username: "ayesha",
                name: "Ayesha",
                email: "ayesha@test.com",
                bio: "Life in little frames 📸",
                avatar: "",
                hue: 190,
                followers: [],
                following: []
            }
        ],

        posts: [],

        comments: []

    };


    function loadDatabase() {

        try {

            const saved =
                localStorage.getItem(DB_KEY);

            if (saved) {
                return JSON.parse(saved);
            }

        } catch (error) {

            console.error(
                "Failed to load local database:",
                error
            );

        }

        return defaultDB;
    }


    let db = loadDatabase();


    function saveDatabase() {

        localStorage.setItem(
            DB_KEY,
            JSON.stringify(db)
        );

    }


    /* =========================================================
       3. SESSION
    ========================================================= */

    function currentUser() {

        const savedUser =
            localStorage.getItem(SESSION_KEY);

        if (!savedUser) {
            return null;
        }

        try {

            return JSON.parse(savedUser);

        } catch (error) {

            return null;

        }

    }


    function isLoggedIn() {

        return Boolean(
            localStorage.getItem(TOKEN_KEY)
        );

    }


    /* =========================================================
       4. HELPERS
    ========================================================= */

    function escapeHTML(value = "") {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function avatarHTML(user, className = "avatar") {

        if (user?.avatar) {

            return `
                <img
                    class="${className}"
                    src="${escapeHTML(user.avatar)}"
                    alt="${escapeHTML(user.name || user.username)}"
                >
            `;

        }

        const name =
            user?.name ||
            user?.username ||
            "User";

        const letter =
            name.charAt(0).toUpperCase();

        const hue =
            user?.hue || 330;

        return `
            <div
                class="${className}"
                style="
                    background:
                    linear-gradient(
                        135deg,
                        hsl(${hue},70%,65%),
                        hsl(${(hue + 55) % 360},70%,50%)
                    );
                "
            >
                ${escapeHTML(letter)}
            </div>
        `;

    }


    function showToast(message) {

        if (!toast) return;

        toast.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    function formatDate(date) {

        if (!date) return "";

        const d =
            new Date(date);

        return d.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =========================================================
       5. THEME
    ========================================================= */

    function loadTheme() {

        const theme =
            localStorage.getItem(THEME_KEY) ||
            "light";

        document.documentElement
            .setAttribute(
                "data-theme",
                theme
            );

    }


    function toggleTheme() {

        const current =
            document.documentElement
                .getAttribute("data-theme");

        const next =
            current === "dark"
                ? "light"
                : "dark";

        document.documentElement
            .setAttribute(
                "data-theme",
                next
            );

        localStorage.setItem(
            THEME_KEY,
            next
        );

        showToast(
            `${next === "dark" ? "Dark" : "Light"} mode enabled`
        );

    }


    /* =========================================================
       6. AUTH SCREEN
    ========================================================= */

    function renderLogin() {

        root.innerHTML = `

            <main class="auth">

                <section class="auth-card">

                    <div class="logo">
                        Gramly
                    </div>

                    <div class="auth-sub">
                        Share moments. Connect with people.
                    </div>

                    <form id="login-form">

                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            required
                        >

                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                        >

                        <div
                            id="login-error"
                            class="form-err"
                        ></div>

                        <button
                            class="btn primary block"
                            type="submit"
                        >
                            Log in
                        </button>

                    </form>

                    <div class="demo">

                        <p>
                            Login using the email and password
                            you registered with.
                        </p>

                    </div>

                </section>

                <section class="auth-card alt">

                    Don't have an account?

                    <button
                        class="link-btn"
                        id="create-account"
                    >
                        Create account
                    </button>

                </section>

            </main>

        `;


        document
            .getElementById("login-form")
            .addEventListener(
                "submit",
                login
            );


        document
            .getElementById("create-account")
            .addEventListener(
                "click",
                renderRegister
            );

    }


    /* =========================================================
       7. LOGIN
    ========================================================= */

    async function login(event) {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const errorBox =
            document.getElementById(
                "login-error"
            );

        errorBox.textContent = "";


        try {

            const data =
                await api.login(
                    email,
                    password
                );


            /* Save JWT */
            localStorage.setItem(
                TOKEN_KEY,
                data.token
            );


            /* Save user */
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(data.user)
            );


            showToast(
                `Welcome @${data.user.username}!`
            );


            render();

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            errorBox.textContent =
                error.message ||
                "Login failed.";

        }

    }


    /* =========================================================
       8. REGISTER SCREEN
    ========================================================= */

    function renderRegister() {

        root.innerHTML = `

            <main class="auth">

                <section class="auth-card">

                    <div class="logo">
                        Gramly
                    </div>

                    <div class="auth-sub">
                        Create your Gramly account
                    </div>

                    <form id="register-form">

                        <input
                            id="register-name"
                            type="text"
                            placeholder="Full Name"
                            required
                        >

                        <input
                            id="register-username"
                            type="text"
                            placeholder="Username"
                            required
                        >

                        <input
                            id="register-email"
                            type="email"
                            placeholder="Email"
                            required
                        >

                        <input
                            id="register-password"
                            type="password"
                            placeholder="Password"
                            minlength="6"
                            required
                        >

                        <div
                            id="register-error"
                            class="form-err"
                        ></div>

                        <button
                            class="btn primary block"
                            type="submit"
                        >
                            Create account
                        </button>

                    </form>

                </section>

                <section class="auth-card alt">

                    Already have an account?

                    <button
                        class="link-btn"
                        id="back-login"
                    >
                        Log in
                    </button>

                </section>

            </main>

        `;


        document
            .getElementById("register-form")
            .addEventListener(
                "submit",
                registerUser
            );


        document
            .getElementById("back-login")
            .addEventListener(
                "click",
                renderLogin
            );

    }


    /* =========================================================
       9. REGISTER
    ========================================================= */

    async function registerUser(event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "register-name"
                )
                .value
                .trim();


        const username =
            document
                .getElementById(
                    "register-username"
                )
                .value
                .trim()
                .toLowerCase();


        const email =
            document
                .getElementById(
                    "register-email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "register-password"
                )
                .value;


        const errorBox =
            document.getElementById(
                "register-error"
            );

        errorBox.textContent = "";


        try {

            const data =
                await api.register({

                    username,
                    name,
                    email,
                    password

                });


            showToast(
                "Account created successfully!"
            );


            /*
                Registration successful.
                Now login screen open karo.
            */

            renderLogin();


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            errorBox.textContent =
                error.message ||
                "Registration failed.";

        }

    }


    /* =========================================================
       10. MAIN APP
    ========================================================= */

    function render() {

        if (!isLoggedIn()) {

            renderLogin();

            return;

        }

        renderApp();

    }


    function renderApp() {

        const user =
            currentUser();

        if (!user) {

            localStorage.removeItem(
                TOKEN_KEY
            );

            renderLogin();

            return;

        }


        root.innerHTML = `

            <div class="app">

                <aside class="sidebar">

                    <div class="logo">
                        Gramly
                    </div>

                    <nav>

                        <button
                            class="nav-item active"
                            data-page="home"
                        >
                            🏠
                            <span>Home</span>
                        </button>

                        <button
                            class="nav-item"
                            data-page="explore"
                        >
                            🔍
                            <span>Explore</span>
                        </button>

                        <button
                            class="nav-item"
                            data-page="profile"
                        >
                            👤
                            <span>Profile</span>
                        </button>

                        <button
                            class="nav-item"
                            data-action="create"
                        >
                            ➕
                            <span>Create</span>
                        </button>

                        <button
                            class="nav-item"
                            data-action="theme"
                        >
                            🌙
                            <span>Theme</span>
                        </button>

                        <button
                            class="nav-item"
                            data-action="logout"
                        >
                            🚪
                            <span>Logout</span>
                        </button>

                    </nav>

                </aside>


                <main class="main">

                    <header class="topbar">

                        <div class="logo">
                            Gramly
                        </div>

                        <div class="top-actions">

                            <button
                                data-action="theme"
                                title="Toggle theme"
                            >
                                🌙
                            </button>

                            <button
                                data-page="profile"
                                title="Profile"
                            >
                                ${avatarHTML(
                                    user,
                                    "avatar small"
                                )}
                            </button>

                        </div>

                    </header>


                    <section id="page-content"></section>

                </main>


                <nav class="bottom-nav">

                    <button
                        data-page="home"
                    >
                        🏠
                    </button>

                    <button
                        data-page="explore"
                    >
                        🔍
                    </button>

                    <button
                        data-action="create"
                    >
                        ➕
                    </button>

                    <button
                        data-page="profile"
                    >
                        👤
                    </button>

                </nav>

            </div>

        `;


        attachAppEvents();

        renderHome();

    }


    /* =========================================================
       11. APP EVENTS
    ========================================================= */

    function attachAppEvents() {

        document
            .querySelectorAll("[data-page]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;

                        if (page === "home") {
                            renderHome();
                        }

                        if (page === "explore") {
                            renderExplore();
                        }

                        if (page === "profile") {
                            renderProfile();
                        }

                    }
                );

            });


        document
            .querySelectorAll("[data-action]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;

                        if (
                            action === "theme"
                        ) {
                            toggleTheme();
                        }

                        if (
                            action === "create"
                        ) {
                            openCreatePost();
                        }

                        if (
                            action === "logout"
                        ) {
                            logout();
                        }

                    }
                );

            });

    }


    /* =========================================================
       12. HOME
    ========================================================= */

    async function renderHome() {

        const page =
            document.getElementById(
                "page-content"
            );

        if (!page) return;


        page.innerHTML = `

            <div class="home">

                <div class="feed">

                    <div class="stories">

                        <div class="story">

                            ${avatarHTML(
                                currentUser(),
                                "story-avatar"
                            )}

                            <span>
                                You
                            </span>

                        </div>

                        <div class="story">

                            <div class="story-avatar gradient">
                                S
                            </div>

                            <span>
                                sara
                            </span>

                        </div>

                        <div class="story">

                            <div class="story-avatar gradient">
                                A
                            </div>

                            <span>
                                ayesha
                            </span>

                        </div>

                    </div>


                    <div id="posts-container">

                        <p>
                            Loading posts...
                        </p>

                    </div>

                </div>

            </div>

        `;


        await loadPosts();

    }


    /* =========================================================
       13. LOAD POSTS FROM BACKEND
    ========================================================= */

    async function loadPosts() {

        const container =
            document.getElementById(
                "posts-container"
            );

        if (!container) return;


        try {

            const posts =
                await api.getPosts();


            if (!posts.length) {

                container.innerHTML = `

                    <div class="post">

                        <div class="post-caption">

                            No posts yet.

                            <br><br>

                            Create your first post! 📸

                        </div>

                    </div>

                `;

                return;

            }


            container.innerHTML =
                posts.map(
                    post => renderPostCard(post)
                ).join("");


            attachPostEvents();


        } catch (error) {

            console.error(
                "Failed to load posts:",
                error
            );


            container.innerHTML = `

                <div class="post">

                    <div class="post-caption">

                        Failed to load posts.

                        <br>

                        ${escapeHTML(
                            error.message
                        )}

                    </div>

                </div>

            `;

        }

    }


    /* =========================================================
       14. POST CARD
    ========================================================= */

    function renderPostCard(post) {

        const user =
            post.user || {};

        const current =
            currentUser();


        const liked =
            Array.isArray(post.likes) &&
            post.likes.some(
                like => {

                    const id =
                        like?._id ||
                        like;

                    return String(id) ===
                        String(current?.id);

                }
            );


        const image =
            post.image;


        return `

            <article
                class="post"
                data-post-id="${post._id}"
            >

                <div class="post-head">

                    <div class="post-author">

                        ${avatarHTML(
                            user,
                            "avatar"
                        )}

                        <div>

                            <strong>
                                ${escapeHTML(
                                    user.username ||
                                    "user"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    user.name || ""
                                )}
                            </small>

                        </div>

                    </div>

                </div>


                ${
                    image
                        ? `
                            <div class="post-media">

                                <img
                                    src="${escapeHTML(
                                        image
                                    )}"
                                    alt="Post image"
                                >

                            </div>
                        `
                        : `
                            

                             <div
    class="post-media text-media"
    style="
        background:
        ${escapeHTML(
            post.background ||
            "linear-gradient(135deg,#7c3aed,#ec4899)"
        )};
    "
>
    <p>
        ${escapeHTML(post.caption || "")}
    </p>
</div>
                        `
                }


                <div class="post-actions">

                    <button
                        class="like-btn"
                        data-like="${post._id}"
                    >
                        ${liked ? "❤️" : "♡"}
                    </button>

                    <button
                        data-comment="${post._id}"
                    >
                        💬
                    </button>

                </div>


                <div class="post-likes">

                    ${post.likes?.length || 0}
                    likes

                </div>


                ${
                    post.caption
                        ? `
                            <div class="post-caption">

                                <strong>
                                    ${escapeHTML(
                                        user.username ||
                                        ""
                                    )}
                                </strong>

                                ${escapeHTML(
                                    post.caption
                                )}

                            </div>
                        `
                        : ""
                }


                <div class="add-comment">

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        data-comment-input="${post._id}"
                    >

                    <button
                        data-add-comment="${post._id}"
                    >
                        Post
                    </button>

                </div>

            </article>

        `;

    }


    /* =========================================================
       15. POST EVENTS
    ========================================================= */

    function attachPostEvents() {

        document
            .querySelectorAll("[data-like]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const postId =
                            button.dataset.like;

                        const post =
                            await api.getPost(
                                postId
                            );


                        const current =
                            currentUser();


                        const alreadyLiked =
                            post.likes?.some(
                                like => {

                                    const id =
                                        like?._id ||
                                        like;

                                    return String(id) ===
                                        String(current?.id);

                                }
                            );


                        try {

                            if (
                                alreadyLiked
                            ) {

                                await api.unlikePost(
                                    postId
                                );

                            } else {

                                await api.likePost(
                                    postId
                                );

                            }

                            await loadPosts();

                        } catch (error) {

                            showToast(
                                error.message
                            );

                        }

                    }
                );

            });


        document
            .querySelectorAll("[data-add-comment]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        addComment(
                            button.dataset.addComment
                        );

                    }
                );

            });


        document
            .querySelectorAll("[data-comment-input]")
            .forEach(input => {

                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter"
                        ) {

                            addComment(
                                input.dataset.commentInput
                            );

                        }

                    }
                );

            });


        document
            .querySelectorAll("[data-comment]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openComments(
                            button.dataset.comment
                        );

                    }
                );

            });

    }


    /* =========================================================
       16. ADD COMMENT
    ========================================================= */

    async function addComment(postId) {

        const input =
            document.querySelector(
                `[data-comment-input="${postId}"]`
            );


        if (!input) return;


        const text =
            input.value.trim();


        if (!text) {

            showToast(
                "Write a comment first."
            );

            return;

        }


        try {

            await api.addComment(
                postId,
                text
            );


            input.value = "";

            showToast(
                "Comment added!"
            );


            openComments(postId);

        } catch (error) {

            showToast(
                error.message
            );

        }

    }


    /* =========================================================
       17. COMMENTS
    ========================================================= */

    async function openComments(postId) {

        modalRoot.innerHTML = `

            <div class="overlay">

                <div class="modal-box">

                    <button
                        class="modal-close"
                        id="close-comments"
                    >
                        ×
                    </button>

                    <h2>
                        Comments
                    </h2>

                    <div id="comments-list">

                        Loading...

                    </div>

                </div>

            </div>

        `;


        document
            .getElementById(
                "close-comments"
            )
            .addEventListener(
                "click",
                closeModal
            );


        try {

            const comments =
                await api.getComments(
                    postId
                );


            const list =
                document.getElementById(
                    "comments-list"
                );


            if (!comments.length) {

                list.innerHTML = `
                    <p>No comments yet.</p>
                `;

                return;

            }


            const current =
                currentUser();


            list.innerHTML =
                comments.map(
                    comment => {

                        const user =
                            comment.user || {};


                        const canDelete =
                            String(
                                user._id
                            ) ===
                            String(
                                current?.id
                            );


                        return `

                            <div class="comment">

                                ${avatarHTML(
                                    user,
                                    "avatar small"
                                )}

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            user.username || ""
                                        )}
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            comment.text
                                        )}
                                    </p>

                                    <small>
                                        ${formatDate(
                                            comment.createdAt
                                        )}
                                    </small>

                                </div>

                                ${
                                    canDelete
                                        ? `
                                            <button
                                                data-delete-comment="${comment._id}"
                                            >
                                                🗑️
                                            </button>
                                        `
                                        : ""
                                }

                            </div>

                        `;

                    }
                ).join("");


            list
                .querySelectorAll(
                    "[data-delete-comment]"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        async () => {

                            try {

                                await api.deleteComment(
                                    button.dataset.deleteComment
                                );

                                showToast(
                                    "Comment deleted."
                                );

                                openComments(
                                    postId
                                );

                            } catch (error) {

                                showToast(
                                    error.message
                                );

                            }

                        }
                    );

                });


        } catch (error) {

            document.getElementById(
                "comments-list"
            ).textContent =
                error.message;

        }

    }


    /* =========================================================
       18. EXPLORE
    ========================================================= */

    async function renderExplore() {

        const page =
            document.getElementById(
                "page-content"
            );

        if (!page) return;


        page.innerHTML = `

            <section class="explore">

                <div class="search-box">

                    <input
                        id="user-search"
                        type="search"
                        placeholder="Search users..."
                    >

                </div>

                <div
                    id="explore-users"
                    class="grid"
                >

                    Loading...

                </div>

            </section>

        `;


        await loadUsers();


        document
            .getElementById("user-search")
            .addEventListener(
                "input",
                event => {

                    filterUsers(
                        event.target.value
                    );

                }
            );

    }


    let cachedUsers = [];


    async function loadUsers() {

        try {

            cachedUsers =
                await api.getUsers();


            renderUsers(
                cachedUsers
            );

        } catch (error) {

            const box =
                document.getElementById(
                    "explore-users"
                );

            if (box) {

                box.textContent =
                    error.message;

            }

        }

    }


    function filterUsers(search) {

        const value =
            search
                .trim()
                .toLowerCase();


        const filtered =
            cachedUsers.filter(
                user =>

                    user.username
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    user.name
                        ?.toLowerCase()
                        .includes(value)

            );


        renderUsers(filtered);

    }


    function renderUsers(users) {

        const box =
            document.getElementById(
                "explore-users"
            );

        if (!box) return;


        if (!users.length) {

            box.innerHTML = `
                <p>No users found.</p>
            `;

            return;

        }


        const current =
            currentUser();


        box.innerHTML =
            users.map(
                user => {

                    if (
                        String(user._id) ===
                        String(current?.id)
                    ) {
                        return "";
                    }


                    const following =
                        user.followers?.some(
                            id =>
                                String(id) ===
                                String(current?.id)
                        );


                    return `

                        <div class="tile">

                            ${avatarHTML(
                                user,
                                "avatar large"
                            )}

                            <h3>
                                ${escapeHTML(
                                    user.username
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    user.name || ""
                                )}
                            </p>

                            <button
                                class="btn primary"
                                data-follow-user="${user._id}"
                                data-following="${following}"
                            >
                                ${
                                    following
                                        ? "Following"
                                        : "Follow"
                                }
                            </button>

                        </div>

                    `;

                }
            ).join("");


        box
            .querySelectorAll(
                "[data-follow-user]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.followUser;

                        const following =
                            button.dataset.following ===
                            "true";


                        try {

                            if (following) {

                                await api.unfollowUser(
                                    id
                                );

                            } else {

                                await api.followUser(
                                    id
                                );

                            }


                            await loadUsers();


                            showToast(
                                following
                                    ? "Unfollowed"
                                    : "Following"
                            );

                        } catch (error) {

                            showToast(
                                error.message
                            );

                        }

                    }
                );

            });

    }


    /* =========================================================
       19. PROFILE
    ========================================================= */

    async function renderProfile() {

        

    const page =
        document.getElementById("page-content");

    if (!page) return;

    try {

        // Current logged-in user
        const user =
            await api.getUser(currentUser().id);

        console.log("PROFILE USER:", user);

        // Get all posts from backend
        const posts =
            await api.getPosts();

        // Only current user's posts
        const mine =
            posts.filter(post => {

                const postUserId =
                    post.user?._id ||
                    post.user?.id;

                return String(postUserId) ===
                       String(user.id);
            });

        console.log("MY POSTS:", mine);
        console.log("MY POSTS COUNT:", mine.length);

        page.innerHTML = `

            <section class="profile">

                <div class="profile-head">

                    ${avatarHTML(
                        user,
                        "avatar profile-avatar"
                    )}

                    <div class="profile-info">

                        <h2>
                            @${escapeHTML(
                                user.username
                            )}
                        </h2>

                        <h3>
                            ${escapeHTML(
                                user.name || ""
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                user.bio || ""
                            )}
                        </p>

                        <button
                            class="btn"
                            id="edit-profile"
                        >
                            Edit Profile
                        </button>

                    </div>

                </div>


                <div class="stats">

                    <div>
                        <strong>
                            ${mine.length}
                        </strong>
                        <span>Posts</span>
                    </div>

                    <div>
                        <strong>
                            ${user.followers?.length || 0}
                        </strong>
                        <span>Followers</span>
                    </div>

                    <div>
                        <strong>
                            ${user.following?.length || 0}
                        </strong>
                        <span>Following</span>
                    </div>

                </div>


                <div
                    id="profile-posts"
                    class="grid"
                >

                    ${
                        mine.length
                        ? mine.map(post => `

                            <div class="tile">

                                ${
                                    post.image
                                    ? `
                                        <img
                                            src="${escapeHTML(
                                                post.image
                                            )}"
                                            alt="Post"
                                        >
                                    `
                                    : `
                                        <div
                                            class="text-media"
                                            style="
                                                background:
                                                ${escapeHTML(
                                                    post.background ||
                                                    "linear-gradient(135deg,#7c3aed,#ec4899)"
                                                )};
                                            "
                                        >
                                            ${escapeHTML(
                                                post.caption || ""
                                            )}
                                        </div>
                                    `
                                }

                            </div>

                        `).join("")

                        : `
                            <p>No posts yet.</p>
                        `
                    }

                </div>

            </section>

        `;


        document
            .getElementById("edit-profile")
            .addEventListener(
                "click",
                openEditProfile
            );


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        page.innerHTML = `
            <p>
                Failed to load profile:
                ${escapeHTML(error.message)}
            </p>
        `;
    }

}


    /* =========================================================
       20. EDIT PROFILE
    ========================================================= */

    function openEditProfile() {

        const user =
            currentUser();


        modalRoot.innerHTML = `

            <div class="overlay">

                <div class="modal-box">

                    <button
                        class="modal-close"
                        id="close-edit"
                    >
                        ×
                    </button>

                    <h2>
                        Edit Profile
                    </h2>

                    <form id="edit-profile-form">

                        <input
                            id="edit-name"
                            type="text"
                            placeholder="Name"
                            value="${escapeHTML(
                                user.name || ""
                            )}"
                        >

                        <textarea
                            id="edit-bio"
                            placeholder="Bio"
                        >${escapeHTML(
                            user.bio || ""
                        )}</textarea>

                        <input
                            id="edit-avatar"
                            type="url"
                            placeholder="Avatar URL"
                            value="${escapeHTML(
                                user.avatar || ""
                            )}"
                        >

                        <button
                            class="btn primary block"
                            type="submit"
                        >
                            Save Changes
                        </button>

                    </form>

                </div>

            </div>

        `;


        document
            .getElementById(
                "close-edit"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "edit-profile-form"
            )
            .addEventListener(
                "submit",
                saveProfile
            );

    }


    async function saveProfile(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "edit-name"
            ).value.trim();


        const bio =
            document.getElementById(
                "edit-bio"
            ).value.trim();


        const avatar =
            document.getElementById(
                "edit-avatar"
            ).value.trim();


        try {

            const data =
                await api.updateProfile({

                    name,
                    bio,
                    avatar

                });


            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(data.user)
            );


            closeModal();

            showToast(
                "Profile updated!"
            );


            renderProfile();

        } catch (error) {

            showToast(
                error.message
            );

        }

    }


    /* =========================================================
       21. CREATE POST
    ========================================================= */

    function openCreatePost() {

    const defaultBackground =
        "linear-gradient(135deg,#7c3aed,#ec4899)";

    modalRoot.innerHTML = `
        <div class="overlay">

            <div class="modal-box cp">

                <button
                    class="icon-btn modal-x"
                    id="close-create"
                >
                    ×
                </button>


                <div class="cp-preview" id="cp-preview">

                    <div
                        class="text-media"
                        id="text-preview"
                        style="
                            background:
                            ${defaultBackground};
                        "
                    >
                        <p id="preview-text">
                            Your post
                        </p>
                    </div>

                </div>


                <div class="cp-side">

                    <div class="cp-user">

                        ${avatarHTML(
                            currentUser(),
                            "avatar"
                        )}

                        <strong>
                            @${escapeHTML(
                                currentUser()?.username ||
                                "user"
                            )}
                        </strong>

                    </div>


                    <textarea
                        id="post-caption"
                        placeholder="Write a caption..."
                        maxlength="300"
                    ></textarea>


                    <label
                        class="btn secondary"
                        style="cursor:pointer"
                    >

                        Choose image

                        <input
                            id="post-image"
                            type="url"
                            placeholder=""
                            hidden
                        >

                    </label>


                    <div class="small muted">
                        Choose a background color
                    </div>


                    <div class="bg-picks">

                        <button
                            type="button"
                            class="bgp on"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #7c3aed,
                                    #ec4899
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #7c3aed,
                                    #ec4899
                                );
                            "
                        ></button>


                        <button
                            type="button"
                            class="bgp"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #0ea5e9,
                                    #14b8a6
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #0ea5e9,
                                    #14b8a6
                                );
                            "
                        ></button>


                        <button
                            type="button"
                            class="bgp"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #f97316,
                                    #ef4444
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #f97316,
                                    #ef4444
                                );
                            "
                        ></button>


                        <button
                            type="button"
                            class="bgp"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #111827,
                                    #4b5563
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #111827,
                                    #4b5563
                                );
                            "
                        ></button>


                        <button
                            type="button"
                            class="bgp"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #ec4899,
                                    #8b5cf6
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #ec4899,
                                    #8b5cf6
                                );
                            "
                        ></button>


                        <button
                            type="button"
                            class="bgp"
                            data-bg="
                                linear-gradient(
                                    135deg,
                                    #22c55e,
                                    #06b6d4
                                )
                            "
                            style="
                                background:
                                linear-gradient(
                                    135deg,
                                    #22c55e,
                                    #06b6d4
                                );
                            "
                        ></button>

                    </div>


                    <button
                        class="btn primary block"
                        id="create-post-submit"
                        type="button"
                    >
                        Share
                    </button>

                </div>

            </div>

        </div>
    `;


    let selectedBackground =
        defaultBackground;


    document
        .getElementById("close-create")
        .addEventListener(
            "click",
            closeModal
        );


    /*
       COLOR SELECTION
    */

    document
        .querySelectorAll(".bgp")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".bgp")
                        .forEach(item => {

                            item.classList.remove(
                                "on"
                            );

                        });


                    button.classList.add(
                        "on"
                    );


                    selectedBackground =
                        button.dataset.bg.trim();


                    const preview =
                        document.getElementById(
                            "text-preview"
                        );


                    if (preview) {

                        preview.style.background =
                            selectedBackground;

                    }

                }
            );

        });


    /*
       CAPTION PREVIEW
    */

    document
        .getElementById("post-caption")
        .addEventListener(
            "input",
            event => {

                const previewText =
                    document.getElementById(
                        "preview-text"
                    );


                if (previewText) {

                    previewText.textContent =
                        event.target.value.trim() ||
                        "Your post";

                }

            }
        );


    /*
       CREATE POST
    */

    document
        .getElementById(
            "create-post-submit"
        )
        .addEventListener(
            "click",
            async () => {

                const caption =
                    document
                        .getElementById(
                            "post-caption"
                        )
                        .value
                        .trim();


                const image =
                    document
                        .getElementById(
                            "post-image"
                        )
                        .value
                        .trim();


                if (!caption && !image) {

                    showToast(
                        "Add caption or image first."
                    );

                    return;
                }


                try {

                    await api.createPost({

                        caption,

                        image,

                        background:
                            selectedBackground

                    });


                    closeModal();


                    showToast(
                        "Post created successfully!"
                    );


                    renderHome();


                } catch (error) {

                    console.error(
                        "Create post error:",
                        error
                    );


                    showToast(
                        error.message ||
                        "Failed to create post."
                    );

                }

            }
        );
}

    /* =========================================================
       22. CREATE POST API
    ========================================================= */

    async function createPost(event) {

        event.preventDefault();


        const caption =
            document
                .getElementById(
                    "post-caption"
                )
                .value
                .trim();


        const image =
            document
                .getElementById(
                    "post-image"
                )
                .value
                .trim();


        if (!caption && !image) {

            showToast(
                "Add caption or image."
            );

            return;

        }


        try {

            await api.createPost({

                caption,
                image

            });


            closeModal();

            showToast(
                "Post created successfully!"
            );


            renderHome();

        } catch (error) {

            showToast(
                error.message
            );

        }

    }


    /* =========================================================
       23. LOGOUT
    ========================================================= */

    function logout() {

        localStorage.removeItem(
            SESSION_KEY
        );


        localStorage.removeItem(
            TOKEN_KEY
        );


        showToast(
            "Logged out successfully."
        );


        render();

    }


    /* =========================================================
       24. CLOSE MODAL
    ========================================================= */

    function closeModal() {

        modalRoot.innerHTML = "";

    }


    /* =========================================================
       25. START APPLICATION
    ========================================================= */

    loadTheme();

    render();

})();