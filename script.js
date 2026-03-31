// Task 11:1
//=== Exercise 1: Synchronious and Asychronious ===
console.log("A");

setTimeout(() => {console.log("B");}, 0);

console.log("C");

setTimeout(() => {console.log("D");}, 100);

console.log("E");

//===  Exercise 2: Call back pattern ===
function loadUser(userId, callback) {
    console.log(`Loading user ${userId}...`);

    setTimeout(() => {
        const user = {
            id: userId,
            name: "Alice",
            age: 25
        };
        callback(user);
    }, 1500);
}

loadUser(101, function(user) {
    console.log("User loaded:", user);
});

console.log("This prints before user is loaded");


// Task 11:2 : Callback Hell & Introduction to Promises
//===  Exercise 1: Experience Call back Hell ===

function getUserData(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "John" });
    }, 1000);
}

function getUserPosts(userId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]);
    }, 1000);
}

function getPostComments(postId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, text: "Great post!" },
            { id: 2, text: "Thanks for sharing" }
        ]);
    }, 1000);
}

getUserData(1, function(user) {
    console.log("User:", user);

    getUserPosts(user.id, function(posts) {
        console.log("Posts:", posts);

        getPostComments(posts[0].id, function(comments) {
            console.log("Comments for first post:", comments);

            // Imagine 3+ more nested levels...
            console.log("Callback hell makes code hard to read 😅");
        });
    });
});

//===  Exercise 2: Promises to the rescue ===

function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve([
                    { id: 1, title: "Post 1" },
                    { id: 2, title: "Post 2" }
                ]);
            } else {
                reject("No posts found");
            }
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (postId > 0) {
                resolve([
                    { id: 1, text: "Great post!" },
                    { id: 2, text: "Thanks for sharing" }
                ]);
            } else {
                reject("No comments found");
            }
        }, 1000);
    });
}

getUserData(1)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id); // return next promise
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id); // next promise
    })
    .then(comments => {
        console.log("Comments for first post:", comments);
        console.log("Much cleaner than callback hell! ✅");
    })
    .catch(error => {
        console.log("Error:", error);
    });


// Task 11:3 : Promise Chaining
//===  Exercise 1: Chain Promises ===
getUserData(1)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id); // returns next promise
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id); // chain next
    })
    .then(comments => {
        console.log("Comments on first post:", comments);
    })
    .catch(error => {
        console.error("Error:", error);
    });

    //===  Exercise 2: Promise.All ===
    const promise1 = getUserData(1);
const promise2 = getUserData(2);
const promise3 = getUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("All users fetched in parallel:", results);
    })
    .catch(error => {
        console.error("One of the promises failed:", error);
    });

    //===  Exercise 3: Promise.Race ===
    const fast = new Promise(resolve => setTimeout(() => resolve("Fast!"), 100));
const slow = new Promise(resolve => setTimeout(() => resolve("Slow!"), 500));

Promise.race([fast, slow])
    .then(result => {
        console.log("Winner:", result); // "Fast!"
    });

        //===  Build: Fetch data of three users ===
        function fetchThreeUsers(userIds) {
    const promises = userIds.map(id => getUserData(id));

    Promise.all(promises)
        .then(users => {
            console.log("Fetched all users at once:", users);
        })
        .catch(error => {
            console.error("Failed to fetch users:", error);
        });
}


// Task 11:4 : Async/Await
//===  Exercise 1: Converting to Async/Await ===
getUserData(1, function(user) {
    getUserPosts(user.id, function(posts) {
        getPostComments(posts[0].id, function(comments) {
            console.log(comments);
        });
    });
});

async function getData() {
    try {
        const user = await getUserData(1);
        const posts = await getUserPosts(user.id);
        const comments = await getPostComments(posts[0].id);
        console.log(comments);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

getData();

//===  Exercise 2: Error Handling with Try/Catch ===
async function fetchUserComments(userId) {
    try {
        const user = await getUserData(userId);

        const posts = await getUserPosts(user.id);

        const comments = await getPostComments(posts[0].id);

        console.log("Comments:", comments);
        return comments;

    } catch (error) {console.error("Failed to fetch data:", error);}
}

fetchUserComments(1);
    
//===  Exercise 3: Parallel with Async/Await ===
async function fetchAllComments(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);

        const commentsArray = await Promise.all(
            posts.map(post => getPostComments(post.id))
        );

        console.log("All comments:", commentsArray);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    }
}

fetchAllComments(1);

//===  Exercise 4: Rewrite the callback hell example using async/await. ===
async function fetchUserComments(userId) {
    try {
        const user = await getUserData(userId);
        
        const posts = await getUserPosts(user.id);
        
        const comments = await getPostComments(posts[0].id);
        
        console.log("Comments:", comments);

        return comments;
    } catch (error) {
    
        console.error("Failed to fetch data:", error);
    }
}
fetchUserComments(1);


// Task 12:1 : Async/Await
// Exercise 1: Basic Fetch using .then()

fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => {
        console.log("Response object:", response);
        console.log("Status:", response.status);
        console.log("OK:", response.ok);

        return response.json();
    })
    .then(data => {
        console.log("User data:", data);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });


    // Exercise 2: Fetch with async/await
async function getUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}
async function main() {
    const user = await getUser(1);
    console.log("User:", user);
}
main();


// Practice: Fetch multiple endpoints
async function runPractice() {
    try {
        // 1. Single user
        const userRes = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const user = await userRes.json();
        console.log("\nSingle User:\n", user);

        // 2. All users
        const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await usersRes.json();
        console.log("\nAll Users:\n", users);

        // 3. Posts for user 1
        const postsRes = await fetch("https://jsonplaceholder.typicode.com/users/1/posts");
        const posts = await postsRes.json();
        console.log("\nPosts for User 1:\n", posts);

    } catch (error) {
        console.error("Error:", error);
    }
}
runPractice();


