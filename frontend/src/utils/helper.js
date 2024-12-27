// check if email is valid or not using regular expression
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// function to form avatar symbols form the name
export const formAvatar = (name) => {
    if (!name) return "";

    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    const initials = words
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");

    return initials;
};
