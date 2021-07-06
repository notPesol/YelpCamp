// play time! create titleCase
function toTitleCase(text) {
    const data = text.split(' ')
    let result = '';
    for (let i = 0; i < data.length; i++) {
        let title = data[i][0].toUpperCase();
        result += title + data[i].slice(1);
        result += ' ';
    }
    return result.trim()
}

console.log(toTitleCase('hhh fdfdf fdsfds dfdf'))
