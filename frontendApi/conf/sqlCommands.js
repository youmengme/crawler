var images = {
    insertOne:'INSERT INTO images (title, keywords, description, category, software, type, copyright, color, format, size, pixel, resolution, label, content, file) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    findByPage: function(param){
        let sql = 'SELECT * FROM images WHERE 1=1';
        if(param.category){
            sql += ' AND category = ?'
        }

        if(param.software){
            sql += ' AND software = ?'
        }

        if(param.type){
            sql += ' AND type = ?'
        }

        if(param.copyright){
            sql += ' AND copyright = ?'
        }

        if(param.format){
            sql += ' AND format = ?'
        }

        if(param.orderby){
            sql += ' ORDER BY ' + param.orderby + 'DESC'
        }

        if(param.offset && param.num) {
            sql += ' limit ' + param.offset + ',' + param.num;
        }
        return sql;
    },
};

var member = {
    insertOne:'INSERT INTO member (mobile, password, uid, combo_id, begin, end, count, point, isopen, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    findByMobile: 'SELECT * FROM member WHERE deleted_at IS NULL AND mobile = ?',
    login: 'SELECT * FROM member WHERE deleted_at IS NULL AND mobile = ? AND password = ?',
    updatePwd:'UPDATE member SET password = ?, updated_at = ? WHERE password = ? AND id = ?',
    updateLoginTime:'UPDATE member SET updated_at = ?, last_login_time = ? WHERE id = ?',
    charge:'UPDATE member SET combo_id = ?, begin = ?, end = ?, count = ?, point = ?, updated_at = ? WHERE id = ?',
    payMoney: 'UPDATE member SET count = count - 1, updated_at = ? WHERE id = ? AND count >= 1',
    payPoint: 'UPDATE member SET point = point - ?, updated_at = ? WHERE id = ?'
};

var password = {
    updateOne:'UPDATE password SET status = ?, member_id = ?, updated_at = ? WHERE password = ?',
    findByPwd: 'SELECT * FROM password WHERE deleted_at IS NULL AND password = ?'
};

var charge = {
    insertOne:'INSERT INTO chargelog (member_id, password, created_at, updated_at) VALUES(?, ?, ?, ?)',
    findByPage: 'SELECT * FROM chargelog WHERE deleted_at IS NULL AND member_id = ? LIMIT ?,?',
    findAll: 'SELECT * FROM chargelog WHERE deleted_at IS NULL AND member_id = ?'
};

var memcombo = {
    insertOne:'INSERT INTO memcombo (member_id, site_id, count, created_at, updated_at) VALUES(?, ?, ?, ?, ?)',
    deleteOne: 'DELETE FROM memcombo WHERE member_id = ?',
    insertMany: 'INSERT INTO memcombo (member_id, site_id, count, created_at, updated_at) VALUES ?',
    findMemcombo: 'SELECT memcombo.*, website.name FROM memcombo INNER JOIN website ON memcombo.site_id = website.id WHERE memcombo.deleted_at IS NULL AND memcombo.member_id = ?',
    payMoney: 'UPDATE memcombo SET count = count - 1, updated_at = ? WHERE member_id = ? AND site_id = ? AND count >= 1',
};

var combo = {
    findOne: 'SELECT * FROM combo WHERE deleted_at IS NULL AND id = ?'
};

var combosite = {
    findComboSite: 'SELECT * FROM combo_site WHERE deleted_at IS NULL AND combo_id = ?'
};

var agents = {
    findById: 'SELECT * FROM users WHERE deleted_at IS NULL AND id = ?'
};

var website = {
    findById: 'SELECT * FROM website WHERE deleted_at IS NULL AND id = ?'
};

var system = {
    findOne: 'SELECT * FROM system WHERE deleted_at IS NULL AND uid = ?'
};

var downlist = {
    findByPage: 'SELECT downlist.* FROM downlist INNER JOIN memdown ON downlist.id=memdown.downlist_id WHERE downlist.deleted_at IS NULL AND memdown.member_id = ? ORDER BY downlist.id DESC LIMIT ?,?',
    findAll: 'SELECT downlist.* FROM downlist INNER JOIN memdown ON downlist.id=memdown.downlist_id WHERE downlist.deleted_at IS NULL AND memdown.member_id = ?',
    updateDownMember:'UPDATE downlist SET member_id = ?, updated_at = ? WHERE id = ?',
    findBySource: 'SELECT * FROM downlist WHERE deleted_at IS NULL AND source = ?',
};

var memdown = {
	findMemDown: 'SELECT * FROM memdown WHERE deleted_at IS NULL AND member_id = ? AND downlist_id = ?',
    insertMemDown:'INSERT INTO memdown (member_id, downlist_id, created_at, updated_at) VALUES(?, ?, ?, ?)',
};

//exports
module.exports = {
    images: images,
    member: member,
    password: password,
    charge: charge,
    combo: combo,
    combosite: combosite,
    memcombo: memcombo,
    agents: agents,
    website: website,
    system: system,
    downlist: downlist,
    memdown: memdown
};