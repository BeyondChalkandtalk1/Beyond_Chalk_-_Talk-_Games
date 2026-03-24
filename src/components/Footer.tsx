const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            {/* <h3 className="font-display text-lg font-bold">
              Beyond Chalk & Talk
            </h3>
            <p className="text-sm opacity-80 font-body">
              Making Mathematics Accessible to All 🌟
            </p> */}
          </div>
          <div className="text-center md:text-right">
            <p className="text-xl opacity-80 font-body">
               Beyond Chalk and Talk (OPC) Pvt. Ltd.® 2023
            </p>
            <p className="text-lg opacity-60 font-body mt-1">
              Educational Games for Mathematical Learning 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
