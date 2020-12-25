
 Github Link:
- [x] Backend: https://github.com/ashrawan/Nepse-Playground-Backend
- [ ] Frontend: https://github.com/ashrawan/Nepse-Playground

### Setup Instruction
1. Install dependencies: ```npm install```  
2. Create database: **nepse-db**  
3. Run App: ```npm start```  

### Loading Initial Data
- Load All Company and Sectors:  
**GET:** [localhost:3000/load/all-company](localhost:3000/load/all-company)  
- Load All Stocks:  
**GET:** [localhost:3000/load/all-stocks](localhost:3000/load/all-stocks)  (~10-15 minutes)

**Info**: To Re-load stocks from missing date to particular date:  
*GET*: *localhost:3000/load/all-stocks?startDate=2020-12-10&endDate=2020-12-25*  
## Completed !!!

Start the nepse-playground-UI to visualize data    
[https://github.com/ashrawan/Nepse-Playground](https://github.com/ashrawan/Nepse-Playground)

### API Details
### Get Companys: [localhost:3000/api/companys/filter](api/companys/filter)  
```
GET api/companys/filter

[   
    {
    id: string;
    name: string;
    symbol: string;
    companyCode: string;
    sectorId: number;
    sector: Sector;
    }
]
```
**Info**:  Dynamic filter is available:   
*GET* localhost:3000/api/companys/filter?name=abc&companyCode=123 ....

### Get Stocks: [localhost:3000/api/stocks/filter](localhost:3000/api/stocks/filter)
```
GET api/stocks/filter

[
    {
    id: number;
    date: string;
    timestamp: string;
    totalTransactions: string;
    totalTradeShares: string;
    totalTradeAmount: string;
    maxPrice: string;
    minPrice: string;
    closePrice: number;
    companyId: number;
    company: Company;
    }
}
```
Stocks Trading:  
GET [localhost:3000/api/stocks/trading](api/stocks/trading)  
Query ?companyId=1&startDate=2020-07-01&endDate=2021-07-01

Response (same format as stocks/filter)

**Note**: Dynamic filter is available only On:   
GET localhost:3000/api/stocks/filter?date=2020-12-24&companyId=1 ....

### Get Stocks Average: [localhost:3000/api/stocks/average](api/stocks/average)  
```
GET api/stocks/average

[   
    {
    companyId: number;
    date: string;
    avgCostPrice: number;
    month: number;
    year: number;
    }
]
```

### Get Graph Data: [localhost:3000/load/company/graphdata/:companyCode/:period](localhost:3000/load/company/graphdata/:companyCode/:period)  
```
GET load/company/graphdata/:companyCode/:period

[   
   [timestamp, value],
   [timestamp, value],
   ......
]
```