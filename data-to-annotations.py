#!/usr/bin/python3

import csv
import sys

if len(sys.argv) == 1:
    print("Usage: data-to-annotations.py <input-file.csv>")
    exit(-1)

csvfile = open(sys.argv[1], 'r')
reader = csv.reader(csvfile)
i = -1
for row in reader:
    i += 1

    #skip first row
    if i == 0:
        continue

    phenotypes = []

    if row[2] == '1':
        phenotypes.append('HP:0000475') #broad neck
        phenotypes.append('HP:0000465') #webbed neck
    if row[3] == '1':
        phenotypes.append('HP:0000271') #abnormality of the face
    if row[4] == '1':
        phenotypes.append('HP:0001928') #abnormality of coagulation
    if row[5] == '1':
        phenotypes.append('HP:0000028') #cryptorchidism
    if row[6] == '1':
        phenotypes.append('HP:0000365') #hearing impairment
    if row[7] == '1':
        phenotypes.append('HP:0001263') #global developmental delay
    if row[8] == '1':
        phenotypes.append('HP:0001639') #hypertrophic cardiomyopathy
    if row[9] == '1':
        phenotypes.append('HP:0002562') #low-set nipples
    if row[10] == '1':
        phenotypes.append('HP:0001004') #lymphedema
    if row[11] == '1':
        phenotypes.append('HP:0011355') #localized skin lesion
    if row[12] == 'ptosis':
        phenotypes.append('HP:0000508') #ptosis
    if row[13] == ' aortic valve thickening':
        phenotypes.append('HP:0001646') #abnormality of the aortic valve
    if row[15] == '1':
        phenotypes.append('HP:0000766') #abnormality of the sternum
    if row[16] == '1':
        phenotypes.append('HP:0001642') #pulmonic stenosis
    if row[17] == '1':
        phenotypes.append('HP:0004322') #short stature

    print('i' + str(i) + '\t' + ';'.join(phenotypes))

