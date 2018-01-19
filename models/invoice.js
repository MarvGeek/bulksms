var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pdf = require('pdfkit');
var pdfTbl = require('voilab-pdf-table');

var invoiceSchema = new Schema({

	line1: String,
	line2: String,
	areaId:String,
	
});


var Invoice = module.exports = mongoose.model('Invoice',invoiceSchema);

module.exports.create = function(details){

	var invoice = new pdf();

    invoice.image('assets/logo.png', {
	   fit: [150, 150],
	   align: 'center',
	});

   invoice.fontSize(25)
   .text('Invoice', 250, 100)

   invoice.fontSize(10)
    .text('Cell: 065 966 3717', 360, 100)

    invoice.fontSize(10)
    .text('Email: marvin@eazydatasolutions.co.za', 360, 110)

    invoice.fontSize(12)
    .text('', 100, 140)

   
    
	var table = new pdfTbl(invoice, {bottomMargin: 30});

	table.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({column: 'description'}))
		 .setColumnsDefaults({headerBorder: 'B',align: 'right'})
		 .addColumns([
                {
                    id: 'description',
                    header: 'Description',
                    align: 'left'
                },
                {
                    id: 'quantity',
                    header: 'Quantity',
                    width: 50
                },
                {
                    id: 'price',
                    header: 'Price',
                    width: 40
                },
                {
                    id: 'total',
                    header: 'Total',
                    width: 70,
                    renderer: function (tb, data) {
                        return 'R ' + data.total;
                    }
                }
            ])
		 .onPageAdded(function (tb) {
                tb.addHeader();
            });
	
	table.addBody([
            {description: 'SMS Bundles', quantity: details.credits, price: 0.30, total: Math.round(details.credits * 0.30 * 100) / 100 },
            
        ]);

	return invoice;
}



module.exports.getDetails = function(id,callback){


	var results = {};

	Address.findById(id, function(err, address) {

		if (err) return handleError(err);

		results.id = address.id;
		results.line1 = address.line1;
		results.line2 = address.line2;

		if(address.areaId != null){

			Area.getDetails(address.areaId,function(err,area){

				if(err) throw err;

				results.area = area;
				callback(null,results);
			})

		}else{
			callback(null,results);
		}
	    

	});
	
}




module.exports.update = function(address,callback){



	var query = {"_id": address.id};
	var update = { $set: { areaId: address.areaId,line1: address.line1,line2: address.line2}};

	Address.updateOne(query,update)
	.then(function(result) {
	  callback(result)
	}) 

	

}
