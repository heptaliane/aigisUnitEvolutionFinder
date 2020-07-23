#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import os.path as osp
import sys
import re
import json
import argparse
from selenium import webdriver
from pykakasi import kakasi

# Logging
from logging import getLogger, StreamHandler, WARNING, INFO
from selenium.webdriver.remote import remote_connection
logger = getLogger()
logger.setLevel(INFO)
logger.addHandler(StreamHandler())
remote_connection.LOGGER.setLevel(WARNING)


# wikiwiki base url
BASE_URL = 'https://wikiwiki.jp/aigiszuki/'


def get_cc_unit_from_li_elem(elems):
    if len(elems) != 4:
        return None

    unit = list()
    for elem in elems:
        label = elem.text
        prefix = re.search(r'☆[\d]', label)
        if prefix is None and re.search('聖霊', label) is None:
            return None

        if re.search('聖霊', label) is None:
            unit.append(label[prefix.end() + 1:])
    return dict(unit=unit)


def get_kakusei_unit_from_li_elem(elems):
    unit = list()
    orb = list()

    for elem in elems:
        label = elem.text
        prefix = re.search(r'☆4金', label)
        suffix = re.search(r'の宝珠', label)
        if prefix is not None and not label.endswith('聖霊'):
            unit.append(label[prefix.end():])
        if suffix is not None:
            orb.append(label[:suffix.start()])

    if len(unit) < 3 or len(orb) == 0:
        return None

    return dict(unit=unit, orb=orb)


def get_job_data(driver, job):
    logger.info('Collect job data: "%s".', job)
    labels = list()
    cc = None
    kakusei = None

    driver.get(osp.join(BASE_URL, 'ユニット', 'クラス', job))
    tables = driver.find_element_by_id('content').\
        find_elements_by_tag_name('table')

    rows = tables[0].find_elements_by_tag_name('tr')
    basename_found = False
    for row in rows:
        elems = row.find_elements_by_tag_name('td')
        if len(elems) == 0:
            continue

        if not basename_found:
            urls = elems[0].find_elements_by_tag_name('a')
            if len(urls) == 0:
                continue
            else:
                basename_found = True
        labels.append(elems[0].text.replace('\n', ''))

    if len(labels) == 0:
        logger.warn('Failed to collect job labels for "%s".', job)
        labels.append(job)

    unit = ''
    for table in tables:
        urls = table.find_elements_by_tag_name('td')[0].\
                     find_elements_by_tag_name('a')
        if len(urls) == 0:
            continue

        imgs = urls[0].find_elements_by_tag_name('img')
        if len(imgs) == 1:
            unit = imgs[0].get_attribute('title')
    if unit.endswith('/'):
        unit = unit[:-1]

    unit_url = osp.join(BASE_URL, unit)
    driver.get(unit_url)
    logger.info('Data is referred from "%s"', osp.join(unit_url))
    itemizes = driver.find_elements_by_class_name('list1')
    for itemize in itemizes:
        items = itemize.find_elements_by_tag_name('li')

        if cc is None:
            cc = get_cc_unit_from_li_elem(items)
            if cc is not None:
                continue

        if kakusei is None:
            kakusei = get_kakusei_unit_from_li_elem(items)
            if kakusei is not None:
                continue

    # Levels: base = 0, cc = 1, kakusei-1 = 2, kakusei-2 = 3
    job_label = list()
    level = 0
    for label in labels:
        if level == 1 and cc is None:
            level = 2

        job_label.append(dict(label=label, level=level))

        if level < 3:
            level += 1

    return dict(label=job_label, cc=cc, kakusei=kakusei)


def get_job_labels(driver):
    driver.get(osp.join(BASE_URL, 'ユニット', 'クラス'))
    tables = driver.find_elements_by_tag_name('table')

    data = list()
    for i in range(3):
        hrefs = tables[i].find_elements_by_tag_name('a')
        for href in hrefs:
            label = href.get_attribute('title').split('/')[-1]
            data.append(label)

    return data


def get_job_lut(joblist, raw_jobs):
    lut = list()
    for raw in raw_jobs:
        lut.append(joblist.index(raw))
    return lut


def get_firefox_driver(headless=True, private=True):
    logger.debug('Set firefox driver')
    options = webdriver.FirefoxOptions()
    profile = webdriver.FirefoxProfile()
    if headless:
        options.add_argument('-headless')
    if private:
        profile.set_preference('browser.privatebrowsing.autostart', True)
    driver = webdriver.Firefox(firefox_profile=profile,
                               options=options)

    return driver


def read_json(path, default=list()):
    try:
        with open(path, 'r') as f:
            data = json.load(f)
    except IOError:
        return default
    return data


def write_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def format_job_data(raw_job_data, ruby_data):
    # Create job id table
    jobs = list(raw_job_data.keys())

    # Extract label data
    labels = [raw_job_data[job].get('label') for job in jobs]
    base_labels = [label[0].get('label') for label in labels]

    kks = kakasi()
    kks.setMode('J', 'H')  # kanji -> hiragana
    kks.setMode('K', 'H')  # katakana -> hiragana
    kks_conv = kks.getConverter()

    def get_ruby(txt):
        return kks_conv.do(txt)

    # Create ruby look up table and cc label look up table
    ruby = dict()
    cc_labels = dict()
    for i, job in enumerate(jobs):
        lbls = labels[i]

        for lbl_data in lbls:
            label = lbl_data.get('label')
            level = lbl_data.get('level')
            rlbl = ruby_data[label] if label in ruby_data else get_ruby(label)
            ruby[rlbl] = dict(id=i, level=level, label=label)
            if level == 1:
                cc_labels[label] = i

    # Create cc and kakusei lookup table for each job
    cc_unit = list()
    kakusei_unit = list()
    kakusei_orb = list()
    for job in jobs:
        logger.info('Create lookup table of "%s"...', job)
        cc = raw_job_data[job].get('cc')
        if cc is not None:
            cc = [base_labels.index(unit) for unit in cc.get('unit')]
        cc_unit.append(cc)

        kakusei = raw_job_data[job].get('kakusei')
        if kakusei is None:
            kakusei_unit.append(None)
            kakusei_orb.append(None)
        else:
            kakusei_unit.append([base_labels.index(unit)
                                 for unit in kakusei.get('unit')])
            kakusei_orb.append([cc_labels[orb] for orb in kakusei.get('orb')])

    return dict(base_label=jobs, ruby=ruby, label=labels,
                cc_unit=cc_unit, kakusei_unit=kakusei_unit, orb=kakusei_orb)


def create_job_data(dst_path, cache_path, ruby_path):
    driver = get_firefox_driver()

    jobs = get_job_labels(driver)
    logger.info('Found %d jobs.', len(jobs))

    data = read_json(cache_path, dict())
    logger.info('%d job data are cached.', len(data.keys()))

    for job in jobs:
        if job in data:
            continue

        data[job] = get_job_data(driver, job)
        write_json(cache_path, data)

    driver.quit()

    # Load manually created ruby list
    ruby = read_json(ruby_path, dict())
    data = format_job_data(data, ruby)
    write_json(dst_path, data)


def parse_arguments(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', '-o', default='./data/jobs.json',
                        help='Path to output data file.')
    parser.add_argument('--no_cache', '-n', action='store_true',
                        help='Clean cache and start create data.')
    parser.add_argument('--ruby_data', '-r', default='data/ruby.json',
                        help='Path to manually rubied labels')
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    CACHE_PATH = './data/.cache.json'
    args = parse_arguments(sys.argv[1:])

    if args.no_cache and osp.exists(CACHE_PATH):
        os.remove(CACHE_PATH)

    create_job_data(args.out, CACHE_PATH, args.ruby_data)
