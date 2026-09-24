const API_BASE = "http://localhost:5000/api";

const api = {

    async request(endpoint, options = {}) {
        const token = localStorage.getItem("gramly_token");

        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
            `${API_BASE}${endpoint}`,
            {
                ...options,
                headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong"
            );
        }

        return data;
    },


    // =========================
    // AUTH
    // =========================

    async register(userData) {
        return this.request(
            "/auth/register",
            {
                method: "POST",
                body: JSON.stringify(userData)
            }
        );
    },


    async login(email, password) {
        return this.request(
            "/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );
    },


    // =========================
    // USERS
    // =========================

    async getUsers() {
        return this.request("/users");
    },


    async getUser(id) {
        return this.request(`/users/${id}`);
    },


    async updateProfile(data) {
        return this.request(
            "/users/profile/update",
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    async followUser(id) {
        return this.request(
            `/users/${id}/follow`,
            {
                method: "POST"
            }
        );
    },


    async unfollowUser(id) {
        return this.request(
            `/users/${id}/follow`,
            {
                method: "DELETE"
            }
        );
    },


    // =========================
    // POSTS
    // =========================

    async getPosts() {
        return this.request("/posts");
    },


    async getPost(id) {
        return this.request(`/posts/${id}`);
    },


    async createPost(data) {
        return this.request(
            "/posts",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    async deletePost(id) {
        return this.request(
            `/posts/${id}`,
            {
                method: "DELETE"
            }
        );
    },


    async likePost(id) {
        return this.request(
            `/posts/${id}/like`,
            {
                method: "POST"
            }
        );
    },


    async unlikePost(id) {
        return this.request(
            `/posts/${id}/like`,
            {
                method: "DELETE"
            }
        );
    },


    // =========================
    // COMMENTS
    // =========================

    async getComments(postId) {
        return this.request(
            `/comments/post/${postId}`
        );
    },


    async addComment(postId, text) {
        return this.request(
            `/comments/post/${postId}`,
            {
                method: "POST",
                body: JSON.stringify({
                    text
                })
            }
        );
    },


    async deleteComment(id) {
        return this.request(
            `/comments/${id}`,
            {
                method: "DELETE"
            }
        );
    }

};