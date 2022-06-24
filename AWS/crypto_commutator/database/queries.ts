export const queries = {
    insertAPI: `
        INSERT INTO prices 
        (Name, CoinMarketCap, CoinBase, CoinStats, Kucoin, CoinPaprika) 
        VALUES ?`,

    insertID: `
        ALTER TABLE favourite
        ADD COLUMN \`?\` varchar(10) NULL`,

    getIDs: `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'heroku_ac42ae435fd2fc6' 
        AND TABLE_NAME = 'favourite'`,

    getCrypto: `
        SELECT DISTINCT Name 
        FROM prices`,

    getRecent: `
        SELECT Name, CoinMarketCap, CoinBase, CoinStats, Kucoin, CoinPaprika  
        FROM prices 
        ORDER BY Date DESC LIMIT 20`,

    updateFavourite: `
        UPDATE favourite 
        SET \`?\` = ?
        WHERE Crypto = ?`,

    getFavourite: `
        SELECT Crypto 
        FROM favourite
        WHERE \`?\` = true`,

    deleteOld: `
        DELETE FROM prices 
        WHERE Date < now() - interval 1 DAY`,

    getInfo: `
        SELECT * FROM prices 
        WHERE Name = ?`
}