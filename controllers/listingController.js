import ListingModel from "../model/Listing";
const Addlisting = async (req, res) => {
  try {
    const {
      specs,
      heading,
      paragraph,
      logolink,
      property_price,
      transaction_cost,
      venq_fee,
      inv_cost,
      mgmt_maintenance,
      projected_gross_rent,
      service_charges,
      annual_net_income,
      main_heading,
      images,
      box_headings,
      sub_heading,
      price,
      fund,
      annualized_return,
      annual_appreciation,
      gross_yield,
      net_yield,
      aname,
      alink,
      dname,
      dlink,
    } = req.body;
    const result = await ListingModel.create({
      specs,
      heading,
      paragraph,
      logolink,
      property_price,
      transaction_cost,
      venq_fee,
      inv_cost,
      mgmt_maintenance,
      projected_gross_rent,
      service_charges,
      annual_net_income,
      main_heading,
      images,
      box_headings,
      sub_heading,
      price,
      fund,
      annualized_return,
      annual_appreciation,
      gross_yield,
      net_yield,
      aname,
      alink,
      dname,
      dlink,
    });
    if (result) {
      res.status(201).json({
        message: "successful",
      });
    } else {
      console.log("listing creation failed");
    }
  } catch (error) {
    console.log(error);
  }
};
