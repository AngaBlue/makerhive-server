import data from "./"

async function init () {
    data.cache.ranks = await data.ranks.fetchAll()
}
init();
