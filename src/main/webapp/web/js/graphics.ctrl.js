

wholeApp.controller('graphicsController', ['$scope', '$http', 'broadcastService', 'FQLService', function($scope, $http, broadcastService, FQLService ) 
{

	$scope.graphicSelected = "Cash Flow";
	
	$scope.barsDefinitions = (window.innerHeight / 2) + "px";

	$scope.generateDefaultsColBars = function()
	{
		var colBars = [];
		colBars[0] = 
		{ 
			text: "CS EUR", 
			enabled: true, 
			color: Chart.defaults.global.colours[0],
			x_values: [39796,     0, 0, 0, 0, 0, 0],
			y_value: 0,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'CREDIT SUISSE' AND CURRENCY = 'EUR'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'CREDIT SUISSE' and currencies.currency = 'EUR' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		colBars[1] = 
		{ 
			text: "CS CHF", 
			enabled: true, 
			color: Chart.defaults.global.colours[1],
			x_values: [38796,     0, 0, 0, 0, 0, 0],
			y_value: 1,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'CREDIT SUISSE' AND CURRENCY = 'CHF'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'CREDIT SUISSE' and currencies.currency = 'CHF' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		colBars[2] = 
		{ 
			text: "CS USD", 
			enabled: true, 
			color: Chart.defaults.global.colours[2],
			x_values: [37796,     0, 0, 0, 0, 0, 0],
			y_value: 2,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'CREDIT SUISSE' AND CURRENCY = 'USD'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'CREDIT SUISSE' and currencies.currency = 'USD' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		colBars[3] = 
		{ 
			text: "ITAU EUR", 
			enabled: true, 
			color: Chart.defaults.global.colours[3],
			x_values: [35796,     0, 0, 0, 0, 0, 0],
			y_value: 3,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'ITAU' AND CURRENCY = 'EUR'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'ITAU' and currencies.currency = 'EUR' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		colBars[4] = 
		{ 
			text: "ITAU USD", 
			enabled: true, 
			color: Chart.defaults.global.colours[4],
			x_values: [10847, 23843, 0, 0, 0, 0, 0],
			y_value: 4,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'ITAU' AND CURRENCY = 'USD'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'ITAU' and currencies.currency = 'USD' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		colBars[5] = 
		{ 
			text: "ITAU UYU", 
			enabled: true, 
			color: Chart.defaults.global.colours[5],
			x_values: [20847, 23843, 0, 0, 0, 0, 0],
			y_value: 5,
//			get: "TRANSACTIONS ( MONTH(day), SUM(credit) ) WITH BANK = 'ITAU' AND CURRENCY = 'UYU'",
			get: "select date_part('month', day), sum(credit) from transactions, accounts, currencies, banks where transactions.account = accounts.fql_id and accounts.bank = banks.fql_id and accounts.currency = currencies.fql_id and banks.name = 'ITAU' and currencies.currency = 'UYU' group by date_part('month', day) ", 
			y: "SUM( credit )",
			x: "MONTH(day)"
		};
		
		return colBars;
	}
	
	$scope.loadColBars = function()
	{
		$scope.colBars = broadcastService.getBarChartColors();
		if ($scope.colBars.length == 0)
		{
			broadcastService.setBarChartColors( $scope.generateDefaultsColBars() );
			$scope.colBars = broadcastService.getBarChartColors();
		}	
	}

	$scope.loadColBars();

	$scope.saveEditChanges = function()
	{
		broadcastService.setBarChartColors( $scope.colBars );
		$scope.loadColBars();
		$scope.data = $scope.getChartData();  // Forces refresh ... 
		$scope.graphics();
	}
	
	$scope.cancelEditChanges = function()
	{
		$scope.loadColBars();
		$scope.graphics();
	}
	
	$scope.getChartData = function()
	{
		var chartData = [];
		$scope.barColors = [];
		
		for (var i=0; i<$scope.colBars.length; i++)
		{
			if ($scope.colBars[i].enabled)
			{
				chartData.push($scope.colBars[i].x_values);
				$scope.barColors.push($scope.colBars[i].color);
			}
		}

		return chartData;
	}

	$scope.toggleColBar = function(x)
	{
		if ($scope.colBars[x].enabled)
		{
			$("#colBar_"+x).css("background-color", "white");
		}
		else
		{
			$("#colBar_"+x).css("background-color", $scope.colBars[x].color);
		}

		$scope.colBars[x].enabled = !$scope.colBars[x].enabled;		

		$scope.data = $scope.getChartData();

	}
	
	$scope.afterGetData = function (response, stmt, params)
	{		

		var colIndex = params.index;
		
console.log("stmt: "+stmt);
console.log("result : "+FQLService.fqlResultOK(response));
console.log("index: "+colIndex);

		if (FQLService.fqlResultOK(response))
		{
			var returnedRows = response.data.resultSet.rows;
			
for (var r=0; r<returnedRows.length; r++ )
{
	console.log(returnedRows[r]);
}
/*
			for (var c=0; c<params.reference.children.length; c++)
			{
				var options = [""];
				var columnIndex  = $scope.getColumnIndex(response.data.resultSet.headers, params.reference.children[c].refLabel);
				for (var i=0; i<returnedRows.length; i++)
				{
					var value = returnedRows[i][columnIndex];
					if (!alreadyThere(value, options))
					{
						options.push(value);
					}
				}
				$scope.referenceValues[params.reference.refForm+":"+params.reference.children[c].refLabel] = options;
			}
*/			
		}

		$scope.data = $scope.getChartData();

	}

	$scope.loadChartData = function()
	{
		if ($scope.graphicSelected == "Cash Flow")
		{
			var formName = broadcastService.getFormSelected().label;
			if (formName == '')
			{
				msgWarning("You can select a Form to filter the related Charts.");
			}

			for (var c=0; c<$scope.colBars.length; c++)
			{
				FQLService.executeFQL("runsql "+$scope.colBars[c].get, $scope.afterGetData, {"index": c} );
//				FQLService.executeFQL("GET "   +$scope.colBars[c].get, $scope.afterGetData, {"index": c} );
			}
//  --
//		$scope.data = $scope.getChartData();
//  --
		}
	}

	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
//	$scope.series = ['IN', 'OUT'];
	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

	$scope.loadChartData();
	
}]);


/*
| 2016-01-06                                      | CREDIT SUISSE                                   | EUR                                             | HOSTEUROPE  INOVICE  18897158                   | 47                                              | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-01-21                                      | CREDIT SUISSE                                   | EUR                                             | TETRALOG SYSTEMS  AG                            | 0                                               | 24795                                           | null                                            | null                                            | null                                            | null                                            |
| 2016-01-21                                      | CREDIT SUISSE                                   | EUR                                             | TETRALOG SYSTEMS  AG                            | 0                                               | 15001                                           | null                                            | null                                            | null                                            | null                                            |
| 2016-01-26                                      | CREDIT SUISSE                                   | EUR                                             | IGNOVUS SW DEV JAN 2016                         | 9800                                            | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-01-27                                      | CREDIT SUISSE                                   | EUR                                             | EXPENSES FERNANDO                               | 1000                                            | 0                                               | null                                            | null                                            | null                                            | null                                            |

| 2016-02-01                                      | CREDIT SUISSE                                   | EUR                                             | MIETE MUNICH FEB 2016                           | 1680                                            | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-01                                      | CREDIT SUISSE                                   | EUR                                             | HOST EUROPE RECHNR, 19006416                    | 46                                              | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-02                                      | CREDIT SUISSE                                   | EUR                                             | EUR TO USD                                      | 14926                                           | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-02                                      | CREDIT SUISSE                                   | EUR                                             | EUR TO CHF                                      | 50                                              | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-03                                      | CREDIT SUISSE                                   | EUR                                             | FEDERICO BECARIA SW SUP JAN 2016                | 3578                                            | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-04                                      | CREDIT SUISSE                                   | EUR                                             | BRIAN TOBLER SW SUPPORT JAN 2016                | 3517                                            | 0                                               | null                                            | null                                            | null                                            | null                                            |
| 2016-02-22                                      | CREDIT SUISSE                                   | EUR                                             | HOST EUROPE RECHNR, 19114066                    | 46                                              | 0                                               | null                                            | null                                            | null                                            | null                                            |


month (DATE) -> mes del dato (dato es tipo fecha)

sum ( dato ) 

GET TRANSACTIONS ( MONTH(day), SUM(credit), SUM(debit) )

GET TRANSACTIONS ( BANK, SUM(credit), SUM(debit) )
GET TRANSACTIONS ( ACCOUNT.BANK, SUM(credit), SUM(debit) )

GET TRANSACTIONS ( ACCOUNT.CURRENCY, SUM(credit), SUM(debit) )

GET TRANSACTIONS ( ACCOUNT, SUM(credit), SUM(debit) )

CREDIT SUISSE EUR XXXX YYYY
CREDIT SUISSE CHF XXXX YYYY
CREDIT SUISSE USD XXXX YYYY

*/











