import vCard from 'vcard'
import util from 'util'

const card = new vCard();

card.readFile("inputs/john-doe.vcf", function(err: any, json: any) {
	console.log(util.inspect(json));
});
