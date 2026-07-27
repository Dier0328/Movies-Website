fetch("https://movieswebsiteforpractice.s3.us-east-2.amazonaws.com/movies.csv")
  .then(res => res.text())
  .then(csvText => {
    // Parse CSV data using PapaParse
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        let movies = results.data;
        
        // Clean and prepare the data
        let cleanedMovies = movies.filter(movie => {
          // Keep only movies that have a valid gross revenue
          let gross = parseFloat(movie.gross);
          return !isNaN(gross) && gross > 0;
        }).map(movie => {
          return {
            name: movie.name,
            gross: parseFloat(movie.gross)
          };
        });

        // Sort by highest revenue
        cleanedMovies.sort((a, b) => b.gross - a.gross);

        // Get top 10
        let top10 = cleanedMovies.slice(0, 10);

        // Prepare data for Chart.js
        const labels = top10.map(movie => movie.name);
        const revenues = top10.map(movie => movie.gross);

        // Render Chart
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Format numbers to currency for tooltips
        const currencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gross Revenue (USD)',
                    data: revenues,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f8fafc' // matches var(--text-primary)
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return currencyFormatter.format(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#94a3b8', // matches var(--text-secondary)
                            callback: function(value) {
                                if (value >= 1e9) {
                                    return '$' + (value / 1e9).toFixed(1) + 'B';
                                }
                                if (value >= 1e6) {
                                    return '$' + (value / 1e6).toFixed(1) + 'M';
                                }
                                return currencyFormatter.format(value);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#94a3b8',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
      }
    });
  })
  .catch(err => console.error("Error fetching or parsing data:", err));
