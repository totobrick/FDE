function SearchUser(users) {
    const container = document.getElementById("users");
    container.innerHTML = filteredResults.map(item => {
        return `
            <div class="result-item">
                <h3>${item.login}</h3>
            </div>
        `;
    }).join('');
}

