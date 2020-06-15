import data from ".";

async function init() {
    data.cache.ranks = await data.ranks.fetchAll()
}

async function hourly() {
    return;
};
setInterval(hourly, 1000 * 60 * 60);

//Init
(async () => {
    await init();
    await hourly();
})()
