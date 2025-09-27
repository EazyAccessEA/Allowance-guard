'use client';

import { useEffect } from 'react';

export default function MobileTableConverter() {
  useEffect(() => {
    const convertTablesToCards = () => {
      const tables = document.querySelectorAll('.prose table');
      
      tables.forEach((table) => {
        // Skip if already converted
        if (table.getAttribute('data-mobile-converted') === 'true') {
          return;
        }
        
        const tableElement = table as HTMLTableElement;
        const rows = Array.from(tableElement.querySelectorAll('tr'));
        
        if (rows.length < 2) return; // Need at least header + 1 data row
        
        const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || '');
        const dataRows = rows.slice(1);
        
        // Create mobile cards container
        const mobileCardsContainer = document.createElement('div');
        mobileCardsContainer.className = 'mobile-table-cards';
        mobileCardsContainer.style.display = 'none';
        
        // Create a card for each data row
        dataRows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          
          if (cells.length === 0) return;
          
          const card = document.createElement('div');
          card.className = 'mobile-card';
          
          // Add header (first cell content)
          const header = document.createElement('div');
          header.className = 'mobile-card-header';
          header.textContent = cells[0].textContent?.trim() || '';
          card.appendChild(header);
          
          // Add comparison rows
          for (let i = 1; i < cells.length && i < headers.length; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'mobile-card-row';
            
            const label = document.createElement('div');
            label.className = 'mobile-card-label';
            label.textContent = headers[i] || '';
            
            const value = document.createElement('div');
            value.className = 'mobile-card-value';
            value.textContent = cells[i].textContent?.trim() || '';
            
            rowDiv.appendChild(label);
            rowDiv.appendChild(value);
            card.appendChild(rowDiv);
          }
          
          mobileCardsContainer.appendChild(card);
        });
        
        // Insert mobile cards after the table
        table.parentNode?.insertBefore(mobileCardsContainer, table.nextSibling);
        
        // Mark as converted
        table.setAttribute('data-mobile-converted', 'true');
      });
    };
    
    // Convert on load
    convertTablesToCards();
    
    // Convert on resize (in case of orientation change)
    const handleResize = () => {
      convertTablesToCards();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return null;
}
