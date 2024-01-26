#!/bin/bash

# Check if correct number of arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <input_file1> <input_file2> <output_file>"
    exit 1
fi

# Assign arguments to variables
input_file1="$1"
input_file2="$2"
output_file="$3"

# Check if the input files exist
if [ ! -f "$input_file1" ]; then
    echo "Error: $input_file1 not found!"
    exit 1
fi

if [ ! -f "$input_file2" ]; then
    echo "$input_file2 not found! So inserting $input_file1 into $output_file "
    cat "$input_file1" > "$output_file"
    exit 1
fi

# Combine the contents of input files and save to the output file
cat "$input_file1" "$input_file2" > "$output_file"
echo "Combined contents of $input_file1 and $input_file2 saved to $output_file"
