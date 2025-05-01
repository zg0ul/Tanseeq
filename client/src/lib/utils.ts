export const dataGridClassNames =
  " bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    // Overall grid container
    border: isDarkMode ? "1px solid #2d3135" : "1px solid #e5e7eb",
    // borderRadius: "4px",
    "& .MuiDataGrid-root": {
      borderBottom: "none",
    },
    // Column headers - where the issue is most visible
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
        // borderBottom: isDarkMode ? "1px solid #2d3135" : "1px solid #e5e7eb",
        borderBottom: "none",
      },
    },


    // Column header divider
    "& .MuiDataGrid-columnSeparator": {
      color: isDarkMode ? "#2d3135" : "#e5e7eb",
    },

    // Fix text and icon colors
    "& .MuiDataGrid-columnHeaderTitle": {
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },

    // Icon buttons (sort, filter, etc)
    "& .MuiButtonBase-root.MuiIconButton-root": {
      color: isDarkMode ? "#a3a3a3" : "inherit",
    },

    // Table cells
    "& .MuiDataGrid-cell": {
      border: "none",
      color: isDarkMode ? "#e5e7eb" : "inherit",
      "&:last-child": {
        borderRight: "none",
      },
    },

    // Row styling
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      "&:hover": {
        backgroundColor: isDarkMode ? "#2a2d31" : "#f9fafb",
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },

    // Footer styles
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      backgroundColor: isDarkMode ? "#1d1f21" : "#fff",
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },

    // Pagination controls
    "& .MuiTablePagination-root": {
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },
    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "#a3a3a3" : "inherit",
    },
    "& .MuiTablePagination-select": {
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },

    // Fix all border colors
    "& .MuiDataGrid-withBorderColor": {
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },

    // General border overrides
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDarkMode ? "#1d1f21" : "#fff",
    },

    // Row selection
    "& .Mui-selected": {
      backgroundColor: isDarkMode ? "#3730a3" : "#e0e7ff",
      "&:hover": {
        backgroundColor: isDarkMode ? "#4338ca" : "#dbeafe",
      },
    },
  };
};
