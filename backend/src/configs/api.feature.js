
class MyQueryHelper {
  constructor(query, queryStr) {
    this.query = query; // This is now an Array (Promise)
    this.queryStr = queryStr;
  }

  /**
   * search based on keyword (Array implementation)
   * @param {*} key search field key
   * @returns after searching finding out data
   */
  search(key) {
    const keyword = this.queryStr.keyword ? this.queryStr.keyword.toLowerCase() : null;

    if (keyword) {
      this.query = (async () => {
        const data = await this.query;
        return data.filter((item) => item[key] && item[key].toLowerCase().includes(keyword));
      })();
    }
    return this;
  }

  /**
   * sort based on keyword (Array implementation)
   * @returns after sorting finding out data
   */
  sort() {
    this.query = (async () => {
      const data = await this.query;
      const sortOrder = this.queryStr.sort === 'desc' ? -1 : 1;
      return data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return (dateA - dateB) * sortOrder;
      });
    })();
    return this;
  }

  /**
   * paginate based on page and limit number (Array implementation)
   * @returns after paginate finding out data
   */
  paginate() {
    this.query = (async () => {
      const data = await this.query;
      const page = this.queryStr.page ? parseInt(this.queryStr.page, 10) : 1;
      const limit = this.queryStr.limit ? parseInt(this.queryStr.limit, 10) : 1000;
      const skip = (page - 1) * limit;
      return data.slice(skip, skip + limit);
    })();
    return this;
  }
}

module.exports = MyQueryHelper;
